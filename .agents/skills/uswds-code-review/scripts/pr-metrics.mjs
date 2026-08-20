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

function getFilename(path) {
  return path.split('/').pop();
}

function hasExtension(path, extensions) {
  return extensions.some(ext => path.endsWith(ext));
}

function inDirectory(path, directories) {
  return directories.some(dir =>
    path.includes(`/${dir}/`) || path.startsWith(`${dir}/`)
  );
}

function matchesPattern(path, pattern) {
  if (typeof pattern === 'string') {
    return path.includes(pattern);
  }
  return pattern.test(path);
}

const CLASSIFIERS = {
  lock: (path) => hasExtension(path, [
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    'Cargo.lock', 'poetry.lock', 'Gemfile.lock',
    'composer.lock', 'go.sum'
  ]),

  manifest: (path) => {
    const filename = getFilename(path);
    if (['package.json', 'Cargo.toml', 'go.mod', 'Gemfile', 'composer.json', 'pyproject.toml'].includes(filename)) {
      return true;
    }
    return /^requirements[^/]*\.txt$/.test(filename) || /^build\.gradle/.test(filename);
  },

  test: (path) => {
    const filename = getFilename(path);
    return inDirectory(path, ['test', 'tests', 'spec', 'specs', '__tests__', '__mocks__', 'e2e', 'cypress']) ||
           /[._-](spec|test)\.[a-z]+$/.test(filename) ||
           filename === 'conftest.py' ||
           (/^test_/.test(filename) && filename.endsWith('.py'));
  },

  story: (path) => {
    const filename = getFilename(path);
    return /\.stories\.[a-z]+$/.test(filename) ||
           inDirectory(path, ['stories']) ||
           filename.endsWith('.mdx');
  },

  ci: (path) =>
    inDirectory(path, ['.github', '.circleci']) ||
    hasExtension(path, ['.gitlab-ci.yml', 'Jenkinsfile', 'azure-pipelines.yml']),

  doc: (path) => {
    const filename = getFilename(path);
    const docFiles = ['CHANGELOG', 'LICENSE', 'CODEOWNERS', 'AUTHORS', 'NOTICE'];
    return hasExtension(path, ['.md', '.markdown', '.rst', '.txt', '.adoc']) ||
           inDirectory(path, ['doc', 'docs']) ||
           docFiles.some(name => filename.startsWith(name));
  },

  asset: (path) => hasExtension(path, [
    '.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp',
    '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.pdf', '.zip'
  ]),

  config: (path) => {
    const filename = getFilename(path);
    const configNames = ['.eslintrc', '.prettierrc', '.editorconfig', '.gitignore', '.npmrc', '.nvmrc', '.babelrc'];
    return configNames.some(name =>
      filename === name || filename.startsWith(`${name}.`)
    );
  },
};

const NON_BUDGET = new Set(['lock', 'test', 'story', 'doc', 'asset', 'ci', 'manifest', 'config']);

const DEP_LINE = /^[+-]\s*"([^"]+)"\s*:\s*"([^"]*)"/;
const DEP_SECTION = /"(dependencies|devDependencies|peerDependencies|optionalDependencies)"\s*:/;
const PKG_MANAGER = /"(packageManager|workspaces|resolutions|overrides)"\s*:/;

function classify(path) {
  for (const [name, classifier] of Object.entries(CLASSIFIERS)) {
    if (classifier(path)) return name;
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
  let currentFile = null, inManifest = false;

  for (const line of text.split('\n')) {
    const diffMatch = line.match(/^diff --git a\/(.+?) b\/(.+)$/);
    if (diffMatch) {
      currentFile = diffMatch[2];
      files[currentFile] = { add: 0, del: 0, kind: classify(currentFile) };
      inManifest = files[currentFile].kind === 'manifest';
      continue;
    }

    if (currentFile === null) continue;
    if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@') ||
        line.startsWith('index ') || line.startsWith('similarity ') ||
        line.startsWith('rename ') || line.startsWith('new file') ||
        line.startsWith('deleted file') || line.startsWith('old mode') ||
        line.startsWith('new mode') || line.startsWith('Binary files')) {
      continue;
    }

    if (line.startsWith('+')) {
      files[currentFile].add++;
    } else if (line.startsWith('-')) {
      files[currentFile].del++;
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
  for (const [filePath, stats] of Object.entries(files)) {
    if (!buckets[stats.kind]) buckets[stats.kind] = { add: 0, del: 0, files: 0 };
    buckets[stats.kind].add += stats.add;
    buckets[stats.kind].del += stats.del;
    buckets[stats.kind].files += 1;
  }

  const runtime = buckets.runtime?.add || 0;
  const tests = buckets.test?.add || 0;
  const newDeps = Object.fromEntries(Object.entries(added).filter(([name]) => !(name in removed)));
  const dropped = Object.fromEntries(Object.entries(removed).filter(([name]) => !(name in added)));
  const bumped = Object.fromEntries(
    Object.keys(added).filter(name => name in removed && removed[name] !== added[name])
      .map(name => [name, `${removed[name]} -> ${added[name]}`])
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
      .map(([path, stats]) => ({ path, kind: stats.kind, add: stats.add, del: stats.del }))
      .sort((a, b) => b.add - a.add),
  };
}

function render(report) {
  const lines = [];
  lines.push('PR METRICS');
  lines.push('='.repeat(62));

  const { runtime_added: runtime, budget, over_budget, budget_pct } = report;
  const flag = over_budget ? 'OVER BUDGET' : 'within budget';
  lines.push(`Runtime lines added : ${runtime} / ${budget}  (${budget_pct}% — ${flag})`);
  if (!over_budget && runtime > budget * 0.5) {
    lines.push('                      note: inside budget but a large PR — consider a split');
  }

  const { test_added, test_ratio: testRatio } = report;
  lines.push(`Test lines added    : ${test_added}` +
    (testRatio !== null ? `  (ratio ${testRatio}:1 vs runtime)` : ''));
  if (runtime >= 5 && test_added === 0) {
    lines.push('                      *** no tests accompany changed runtime code ***');
  } else if (testRatio !== null && runtime >= 20 && testRatio < 0.5) {
    lines.push('                      note: low test ratio for the amount of new logic');
  }

  lines.push(`Files changed       : ${report.total_files}`);
  lines.push('');
  lines.push('Breakdown by kind:');
  for (const [kind, bucket] of Object.entries(report.buckets).sort((a, b) => b[1].add - a[1].add)) {
    const mark = kind === 'runtime' ? '*' : ' ';
    lines.push(`  ${mark} ${kind.padEnd(10)} ${String(bucket.files).padStart(3)} files  +${String(bucket.add).padEnd(6)} -${bucket.del}`);
  }

  lines.push('');
  lines.push('Dependencies:');
  if (Object.keys(report.new_dependencies).length) {
    lines.push('  !! NEW (require explicit justification from the issue):');
    for (const [name, version] of Object.entries(report.new_dependencies)) {
      lines.push(`       + ${name} @ ${version}`);
    }
  }
  if (Object.keys(report.bumped_dependencies).length) {
    lines.push('  ~  version bumps:');
    for (const [name, versions] of Object.entries(report.bumped_dependencies)) {
      lines.push(`       ${name}: ${versions}`);
    }
  }
  if (Object.keys(report.dropped_dependencies).length) {
    lines.push('  -  removed (verify nothing still imports these):');
    for (const name of Object.keys(report.dropped_dependencies)) {
      lines.push(`       - ${name}`);
    }
  }
  if (report.package_manager_changes.length) {
    lines.push('  !! PACKAGE MANAGER / WORKSPACE CHANGES — project-wide decision:');
    for (const change of report.package_manager_changes) {
      lines.push(`       ${change}`);
    }
  }
  if (!Object.keys(report.new_dependencies).length &&
      !Object.keys(report.bumped_dependencies).length &&
      !Object.keys(report.dropped_dependencies).length &&
      !report.package_manager_changes.length) {
    lines.push('  none');
  }

  lines.push('');
  lines.push('Largest files by lines added:');
  for (const file of report.files.slice(0, 12)) {
    lines.push(`  +${String(file.add).padEnd(6)} -${String(file.del).padEnd(6)} [${file.kind.padEnd(8)}] ${file.path}`);
  }

  lines.push('');
  lines.push('-'.repeat(62));
  lines.push('These are inputs to judgment, not a verdict. Size within budget does not');
  lines.push('mean the scope is right; tests present does not mean coverage is adequate.');
  return lines.join('\n');
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
