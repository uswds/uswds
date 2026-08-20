#!/usr/bin/env node
/**
 * Compute the mechanical gate inputs for a pull request.
 *
 * Reports runtime lines added (excluding tests, docs, lockfiles, assets), the
 * test-to-runtime ratio, dependency manifest changes, and per-file classification.
 *
 * Usage:
 *     node pr-metrics.mjs --diff changes.patch
 *     node pr-metrics.mjs --pr https://github.com/org/repo/pull/123
 *     node pr-metrics.mjs --diff - < changes.patch
 *     node pr-metrics.mjs --diff changes.patch --budget 400 --json
 *
 * Getting a diff without network access to the API:
 *     git diff main...HEAD > changes.patch
 *     gh pr diff 123 > changes.patch
 */

import { readFileSync } from 'fs';
import { spawn } from 'child_process';
import { createInterface } from 'readline';

// --- file classification ------------------------------------------------------
const RULES = [
  ['lock', /(^|\/)((package-lock|yarn\.lock|pnpm-lock\.yaml|Cargo\.lock|poetry\.lock|Gemfile\.lock|composer\.lock|go\.sum))$/],
  ['manifest', /(^|\/)(package\.json|requirements[^/]*\.txt|pyproject\.toml|Cargo\.toml|go\.mod|Gemfile|composer\.json|build\.gradle[^/]*)$/],
  ['test', /(^|\/)((tests?|specs?|__tests__|__mocks__|e2e|cypress)\/|[._-](spec|test)\.[a-z]+$|(^|\/)conftest\.py$|(^|\/)test_[^/]+\.py$)/],
  ['story', /\.stories\.[a-z]+$|(^|\/)stories\/|\.mdx$/],
  ['ci', /(^|\/)\.github\/|(^|\/)\.gitlab-ci\.yml$|(^|\/)Jenkinsfile$|(^|\/)\.circleci\/|(^|\/)azure-pipelines\.yml$/],
  ['doc', /\.(md|markdown|rst|txt|adoc)$|(^|\/)docs?\/|(^|\/)(CHANGELOG|LICENSE|CODEOWNERS|AUTHORS|NOTICE)/],
  ['asset', /\.(svg|png|jpe?g|gif|ico|webp|woff2?|ttf|eot|mp4|pdf|zip)$/],
  ['config', /(^|\/)\.(eslintrc|prettierrc|editorconfig|gitignore|npmrc|nvmrc|babelrc)|\.(eslintrc|prettierrc)\.[a-z]+$/],
];
const NON_BUDGET = new Set(['lock', 'test', 'story', 'doc', 'asset', 'ci', 'manifest', 'config']);

const DEP_LINE = /^[+-]\s*"([^"]+)"\s*:\s*"([^"]*)"/;
const DEP_SECTION = /"(dependencies|devDependencies|peerDependencies|optionalDependencies)"\s*:/;
const PKG_MANAGER = /"(packageManager|workspaces|resolutions|overrides)"\s*:/;

function classify(path) {
  for (const [name, rx] of RULES) {
    if (rx.test(path)) return name;
  }
  return 'runtime';
}

async function fetchPRDiff(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) {
    console.error(`Could not parse a GitHub PR URL from: ${url}`);
    process.exit(1);
  }
  const [, owner, repo, num] = match;

  // Try gh CLI first
  try {
    const diff = await exec('gh', ['pr', 'diff', num, '--repo', `${owner}/${repo}`], { timeout: 90000 });
    if (diff.trim()) return diff;
  } catch (err) {
    // fall through to API
  }

  // Fall back to GitHub API
  const headers = ['-H', 'Accept: application/vnd.github.v3.diff'];
  if (process.env.GITHUB_TOKEN) {
    headers.push('-H', `Authorization: Bearer ${process.env.GITHUB_TOKEN}`);
  }
  try {
    const diff = await exec('curl', ['-sL', '--max-time', '90', ...headers,
      `https://api.github.com/repos/${owner}/${repo}/pulls/${num}`], { timeout: 95000 });
    if (!diff.trim() || diff.trimStart().startsWith('{')) {
      console.error('Could not fetch the diff. Install the `gh` CLI, set GITHUB_TOKEN, or pass a local diff with --diff.');
      process.exit(1);
    }
    return diff;
  } catch (err) {
    console.error('Failed to fetch diff:', err.message);
    process.exit(1);
  }
}

async function exec(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { timeout: opts.timeout });
    let stdout = '', stderr = '';
    proc.stdout?.on('data', d => stdout += d);
    proc.stderr?.on('data', d => stderr += d);
    proc.on('error', reject);
    proc.on('close', code => {
      if (code !== 0 && code !== null) reject(new Error(`${cmd} exited ${code}: ${stderr}`));
      else resolve(stdout);
    });
  });
}

async function readStdin() {
  const lines = [];
  const rl = createInterface({ input: process.stdin });
  for await (const line of rl) {
    lines.push(line);
  }
  return lines.join('\n');
}

function parseDiff(text) {
  const files = {};
  const addedDeps = {}, removedDeps = {}, managerChanges = [];
  let cur = null, inManifest = false;

  for (const line of text.split('\n')) {
    const diffMatch = line.match(/^diff --git a\/(.+?) b\/(.+)$/);
    if (diffMatch) {
      cur = diffMatch[2];
      files[cur] = { add: 0, del: 0, kind: classify(cur) };
      inManifest = files[cur].kind === 'manifest';
      continue;
    }

    if (cur === null) continue;
    if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@') ||
        line.startsWith('index ') || line.startsWith('similarity ') ||
        line.startsWith('rename ') || line.startsWith('new file') ||
        line.startsWith('deleted file') || line.startsWith('old mode') ||
        line.startsWith('new mode') || line.startsWith('Binary files')) {
      continue;
    }

    if (line.startsWith('+')) {
      files[cur].add++;
    } else if (line.startsWith('-')) {
      files[cur].del++;
    } else {
      continue;
    }

    if (inManifest) {
      if (PKG_MANAGER.test(line) && line[0] === '+') {
        managerChanges.push(line.slice(1).trim().slice(0, 100));
      }
      const depMatch = DEP_LINE.exec(line);
      if (depMatch && !DEP_SECTION.test(line)) {
        const [, name, ver] = depMatch;
        // crude but effective: dependency values look like version ranges
        if (/^[\^~>=<*\d]|^(latest|next|workspace:|file:|git|https?)/.test(ver)) {
          (line[0] === '+' ? addedDeps : removedDeps)[name] = ver;
        }
      }
    }
  }

  return { files, addedDeps, removedDeps, managerChanges };
}

function buildReport(files, added, removed, managers, budget) {
  const buckets = {};
  for (const [f, st] of Object.entries(files)) {
    if (!buckets[st.kind]) buckets[st.kind] = { add: 0, del: 0, files: 0 };
    buckets[st.kind].add += st.add;
    buckets[st.kind].del += st.del;
    buckets[st.kind].files += 1;
  }

  const runtime = buckets.runtime?.add || 0;
  const tests = buckets.test?.add || 0;
  const newDeps = Object.fromEntries(Object.entries(added).filter(([k]) => !(k in removed)));
  const dropped = Object.fromEntries(Object.entries(removed).filter(([k]) => !(k in added)));
  const bumped = Object.fromEntries(
    Object.keys(added).filter(k => k in removed && removed[k] !== added[k])
      .map(k => [k, `${removed[k]} -> ${added[k]}`])
  );

  return {
    runtime_added: runtime,
    budget,
    over_budget: runtime > budget,
    budget_pct: budget ? Math.round(100 * runtime / budget) : null,
    test_added: tests,
    test_ratio: runtime ? Math.round((tests / runtime) * 100) / 100 : null,
    total_files: Object.keys(files).length,
    buckets,
    new_dependencies: newDeps,
    dropped_dependencies: dropped,
    bumped_dependencies: bumped,
    package_manager_changes: managers,
    files: Object.entries(files)
      .map(([path, s]) => ({ path, kind: s.kind, add: s.add, del: s.del }))
      .sort((a, b) => b.add - a.add),
  };
}

function render(r) {
  const L = [];
  L.push('PR METRICS');
  L.push('='.repeat(62));

  const { runtime_added: rt, budget, over_budget, budget_pct } = r;
  const flag = over_budget ? 'OVER BUDGET' : 'within budget';
  L.push(`Runtime lines added : ${rt} / ${budget}  (${budget_pct}% — ${flag})`);
  if (!over_budget && rt > budget * 0.5) {
    L.push('                      note: inside budget but a large PR — consider a split');
  }

  const { test_added, test_ratio: tr } = r;
  L.push(`Test lines added    : ${test_added}` +
    (tr !== null ? `  (ratio ${tr}:1 vs runtime)` : ''));
  if (rt >= 5 && test_added === 0) {
    L.push('                      *** no tests accompany changed runtime code ***');
  } else if (tr !== null && rt >= 20 && tr < 0.5) {
    L.push('                      note: low test ratio for the amount of new logic');
  }

  L.push(`Files changed       : ${r.total_files}`);
  L.push('');
  L.push('Breakdown by kind:');
  for (const [kind, b] of Object.entries(r.buckets).sort((a, b) => b[1].add - a[1].add)) {
    const mark = kind === 'runtime' ? '*' : ' ';
    L.push(`  ${mark} ${kind.padEnd(10)} ${String(b.files).padStart(3)} files  +${String(b.add).padEnd(6)} -${b.del}`);
  }

  L.push('');
  L.push('Dependencies:');
  if (Object.keys(r.new_dependencies).length) {
    L.push('  !! NEW (require explicit justification from the issue):');
    for (const [k, v] of Object.entries(r.new_dependencies)) {
      L.push(`       + ${k} @ ${v}`);
    }
  }
  if (Object.keys(r.bumped_dependencies).length) {
    L.push('  ~  version bumps:');
    for (const [k, v] of Object.entries(r.bumped_dependencies)) {
      L.push(`       ${k}: ${v}`);
    }
  }
  if (Object.keys(r.dropped_dependencies).length) {
    L.push('  -  removed (verify nothing still imports these):');
    for (const k of Object.keys(r.dropped_dependencies)) {
      L.push(`       - ${k}`);
    }
  }
  if (r.package_manager_changes.length) {
    L.push('  !! PACKAGE MANAGER / WORKSPACE CHANGES — project-wide decision:');
    for (const c of r.package_manager_changes) {
      L.push(`       ${c}`);
    }
  }
  if (!Object.keys(r.new_dependencies).length &&
      !Object.keys(r.bumped_dependencies).length &&
      !Object.keys(r.dropped_dependencies).length &&
      !r.package_manager_changes.length) {
    L.push('  none');
  }

  L.push('');
  L.push('Largest files by lines added:');
  for (const f of r.files.slice(0, 12)) {
    L.push(`  +${String(f.add).padEnd(6)} -${String(f.del).padEnd(6)} [${f.kind.padEnd(8)}] ${f.path}`);
  }

  L.push('');
  L.push('-'.repeat(62));
  L.push('These are inputs to judgment, not a verdict. Size within budget does not');
  L.push('mean the scope is right; tests present does not mean coverage is adequate.');
  return L.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  let diffPath = null, prUrl = null, budget = 400, jsonOutput = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--diff') diffPath = args[++i];
    else if (args[i] === '--pr') prUrl = args[++i];
    else if (args[i] === '--budget') budget = parseInt(args[++i], 10);
    else if (args[i] === '--json') jsonOutput = true;
    else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`Usage:
  node pr-metrics.mjs --diff <path>
  node pr-metrics.mjs --pr <github-url>
  node pr-metrics.mjs --diff - < changes.patch
  node pr-metrics.mjs --diff changes.patch --budget 400 --json

Options:
  --diff <path>    Path to a diff/patch file, or - for stdin
  --pr <url>       GitHub pull request URL
  --budget <n>     Runtime line budget (default 400)
  --json           Output JSON instead of a formatted report
  --help, -h       Show this help`);
      process.exit(0);
    }
  }

  if (!diffPath && !prUrl) {
    console.error('Error: must specify either --diff or --pr\n');
    process.exit(1);
  }

  let text;
  if (prUrl) {
    text = await fetchPRDiff(prUrl);
  } else if (diffPath === '-') {
    text = await readStdin();
  } else {
    try {
      text = readFileSync(diffPath, 'utf-8');
    } catch (err) {
      console.error(`Error reading ${diffPath}:`, err.message);
      process.exit(1);
    }
  }

  if (!text.trim()) {
    console.error('Empty diff.');
    process.exit(1);
  }

  const { files, addedDeps, removedDeps, managerChanges } = parseDiff(text);
  if (Object.keys(files).length === 0) {
    console.error('No files parsed — is this a unified diff?');
    process.exit(1);
  }

  const report = buildReport(files, addedDeps, removedDeps, managerChanges, budget);
  console.log(jsonOutput ? JSON.stringify(report, null, 2) : render(report));
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
