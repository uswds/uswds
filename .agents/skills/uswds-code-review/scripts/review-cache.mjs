#!/usr/bin/env node
/**
 * Review Cache Manager for uswds-code-review skill.
 *
 * Manages the unversioned review cache stored in .review-cache/ at repo root.
 * - Prevents re-reviewing PRs when commit hash has not changed
 * - Saves full findings markdown to .review-cache/<commit-sha>.md
 * - Stores review metadata and summary in .review-cache/cache.json
 * - Tracks whether each reviewed PR is still open or has merged
 *
 * Entries are never deleted. A merged PR keeps its cache entry and its findings
 * markdown, and is marked `status: "merged"` instead — the review of a merged PR
 * is exactly the artifact you want when a regression surfaces later.
 *
 * Only PR reviews are cached. Local-branch reviews (`/uswds-code-review` with no
 * argument) have no stable identity to key on — a local branch's HEAD moves with
 * every amend and there is no remote state to compare against — so `save` and
 * `check` both require --pr.
 *
 * Usage:
 *   node review-cache.mjs check --pr 6767
 *   node review-cache.mjs save --pr 6767 --sha abc1234 --recommendation "Request changes" --summary "..." --report-file report.md
 *   node review-cache.mjs sync
 *   node review-cache.mjs list
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { parseArgs, promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const STATUS_OPEN = "open";
export const STATUS_MERGED = "merged";

/** Conventional cache directory name, relative to the repo root. */
export const CACHE_DIR_NAME = ".review-cache";

export const CHECK_STATUS = {
  CACHED: "CACHED",
  MISS: "MISS",
  MERGED: "MERGED",
  ERROR: "ERROR",
};

export const CHECK_EXIT_CODES = {
  [CHECK_STATUS.CACHED]: 0,
  [CHECK_STATUS.MISS]: 1,
  [CHECK_STATUS.MERGED]: 2,
  [CHECK_STATUS.ERROR]: 3,
};

const shortSha = (sha, fallback = "unknown") =>
  sha ? String(sha).slice(0, 7) : fallback;

export function findRepoRoot(startDir = process.cwd()) {
  let cur = resolve(startDir);
  while (cur !== dirname(cur)) {
    if (existsSync(join(cur, ".git"))) {
      return cur;
    }
    cur = dirname(cur);
  }
  return resolve(startDir);
}

export function getDefaultCacheDir(startDir = process.cwd()) {
  return join(findRepoRoot(startDir), CACHE_DIR_NAME);
}

/** Findings for a commit always live at <cacheDir>/<sha>.md. */
export function reportFilePath(cacheDir, sha) {
  return join(cacheDir, `${sha}.md`);
}

export function loadCache(cacheDir = getDefaultCacheDir()) {
  const cacheFile = join(cacheDir, "cache.json");
  if (!existsSync(cacheFile)) {
    return { version: 1, reviews: {} };
  }
  try {
    const data = JSON.parse(readFileSync(cacheFile, "utf-8"));
    if (!data.reviews || typeof data.reviews !== "object") {
      throw new Error("no reviews object");
    }
    return data;
  } catch (err) {
    throw new Error(
      `Cache at ${cacheFile} is unreadable (${err.message}). Move it aside to ` +
        `start fresh — the report markdown in that directory is not affected.`,
      { cause: err },
    );
  }
}

/**
 * Write cache atomically to prevent corrupted cache.json files if the process
 * is interrupted or terminated midway through writing.
 */
export function writeCache(cacheData, cacheDir = getDefaultCacheDir()) {
  mkdirSync(cacheDir, { recursive: true });
  const payload = {
    version: cacheData.version || 1,
    updatedAt: new Date().toISOString(),
    reviews: cacheData.reviews || {},
  };
  const targetPath = join(cacheDir, "cache.json");
  const tempPath = `${targetPath}.${randomBytes(6).toString("hex")}.tmp`;

  writeFileSync(tempPath, JSON.stringify(payload, null, 2), "utf-8");
  renameSync(tempPath, targetPath);
}

function readReport(cacheDir, entry) {
  const absolutePath = reportFilePath(cacheDir, entry.headSha);
  if (!existsSync(absolutePath)) {
    return { reportExists: false, reportContent: null };
  }
  try {
    return {
      reportExists: true,
      reportContent: readFileSync(absolutePath, "utf-8"),
    };
  } catch {
    // Unreadable report degrades to metadata-only; not fatal.
    return { reportExists: true, reportContent: null };
  }
}

function getCachedReviewDetails(cacheDir, entry) {
  return {
    recommendation: entry.recommendation,
    summary: entry.summary,
    reviewedAt: entry.reviewedAt,
    reportPath: reportFilePath(cacheDir, entry.headSha),
    ...readReport(cacheDir, entry),
  };
}

export async function execCmd(cmd, args, opts = {}) {
  try {
    const { stdout } = await execFileAsync(cmd, args, {
      timeout: opts.timeout || 60000,
      killSignal: opts.killSignal || "SIGKILL",
      encoding: "utf-8",
      ...opts,
    });
    return stdout.trim();
  } catch (err) {
    const stderr = (err.stderr || "").trim();
    if (err.signal) {
      throw new Error(`${cmd} terminated by signal ${err.signal}: ${stderr}`);
    }
    if (err.code !== undefined && err.code !== null) {
      throw new Error(`${cmd} exited with code ${err.code}: ${stderr}`);
    }
    throw err;
  }
}

export function parsePRNumber(prInput) {
  if (!prInput) return null;
  if (typeof prInput === "number") return prInput;
  const match = String(prInput).match(/(?:pull\/|#|^)(\d+)(?:\/|\b|$)/);
  return match ? parseInt(match[1], 10) : null;
}

export async function fetchPRInfo(
  prNumber,
  repo = "uswds/uswds",
  execFn = execCmd,
) {
  try {
    const jsonStr = await execFn("gh", [
      "pr",
      "view",
      String(prNumber),
      "--repo",
      repo,
      "--json",
      "number,title,state,mergedAt,headRefOid,url,baseRefName",
    ]);
    return JSON.parse(jsonStr);
  } catch (err) {
    throw new Error(
      `Failed to fetch PR #${prNumber} from ${repo}: ${err.message}`,
      { cause: err },
    );
  }
}

/**
 * `state` is authoritative, but a PR fetched right after a merge can still
 * report OPEN while carrying a mergedAt timestamp, so trust either signal.
 */
function isMergedPR(prInfo) {
  return prInfo.state === "MERGED" || Boolean(prInfo.mergedAt);
}

/**
 * Resolve a PR's current head commit and merge state.
 *
 * `offline` skips the network entirely and trusts the caller's sha. Otherwise a
 * successful fetch is authoritative, and `sha` is only a fallback for when the
 * lookup fails. Returns `{ error }` when neither source yields a commit.
 */
async function resolvePRHead({
  prNum,
  sha,
  repo,
  offline,
  fetchPRInfoFn,
  execFn,
}) {
  if (!offline) {
    try {
      const prInfo = await fetchPRInfoFn(prNum, repo, execFn);
      return {
        prInfo,
        currentSha: prInfo.headRefOid,
        isMerged: isMergedPR(prInfo),
      };
    } catch (err) {
      if (!sha) {
        return { error: err.message };
      }
    }
  }
  return { prInfo: null, currentSha: sha, isMerged: false };
}

export async function checkReview({
  pr,
  sha = null,
  repo = "uswds/uswds",
  cacheDir = getDefaultCacheDir(),
  offline = false,
  fetchPRInfoFn = fetchPRInfo,
  execFn = execCmd,
}) {
  const prNum = parsePRNumber(pr);

  if (!prNum) {
    return {
      status: CHECK_STATUS.ERROR,
      pr: null,
      message:
        "A PR number is required. Local-branch reviews are not cached; run the review directly.",
    };
  }

  const cache = loadCache(cacheDir);

  const { prInfo, currentSha, isMerged, error } = await resolvePRHead({
    prNum,
    sha,
    repo,
    offline,
    fetchPRInfoFn,
    execFn,
  });

  if (error) {
    return { status: CHECK_STATUS.ERROR, pr: prNum, message: error };
  }

  if (!currentSha) {
    return {
      status: CHECK_STATUS.ERROR,
      pr: prNum,
      message:
        "--offline requires --sha, since the head commit cannot be read.",
    };
  }

  const cachedEntry = cache.reviews?.[String(prNum)] || null;

  if (isMerged && !cachedEntry) {
    return {
      status: CHECK_STATUS.MERGED,
      pr: prNum,
      headSha: currentSha,
      cached: false,
      message: `PR #${prNum} is merged and was never reviewed through this cache.`,
    };
  }

  // A merged PR keeps its entry and its findings markdown; only the status
  // changes. The review is still the best record of what was examined.
  if (isMerged) {
    if (cachedEntry.status !== STATUS_MERGED) {
      cachedEntry.status = STATUS_MERGED;
      cachedEntry.mergedAt = prInfo?.mergedAt || new Date().toISOString();
      writeCache(cache, cacheDir);
    }
    return {
      status: CHECK_STATUS.MERGED,
      pr: prNum,
      headSha: currentSha,
      cached: true,
      reviewedSha: cachedEntry.headSha,
      mergedAt: cachedEntry.mergedAt,
      ...getCachedReviewDetails(cacheDir, cachedEntry),
      message: `PR #${prNum} is merged. Its review of ${shortSha(cachedEntry.headSha)} is retained in the cache.`,
    };
  }

  if (cachedEntry?.headSha === currentSha) {
    return {
      status: CHECK_STATUS.CACHED,
      pr: prNum,
      headSha: currentSha,
      ...getCachedReviewDetails(cacheDir, cachedEntry),
      message: `PR #${prNum} was already reviewed at commit ${shortSha(currentSha)}. No new commit activity.`,
    };
  }

  return {
    status: CHECK_STATUS.MISS,
    pr: prNum,
    headSha: currentSha,
    title: prInfo?.title || null,
    previousSha: cachedEntry?.headSha || null,
    message: cachedEntry
      ? `PR #${prNum} has new commit activity (${shortSha(cachedEntry.headSha)} -> ${shortSha(currentSha)}). Re-review needed.`
      : `PR #${prNum} is not in cache. Review needed.`,
  };
}

/**
 * A SHA is interpolated straight into a cache filename, so reject anything that
 * isn't one rather than letting `../` escape the cache directory. Also catches
 * truncated or mistyped hashes before they become a phantom cache entry.
 */
export function assertValidSha(sha) {
  if (!sha) {
    throw new Error("Cannot save review without commit SHA (sha is required)");
  }
  if (!/^[0-9a-f]{7,40}$/i.test(String(sha))) {
    throw new Error(
      `Invalid commit SHA: ${sha}. Expected 7-40 hexadecimal characters.`,
    );
  }
  return String(sha);
}

export function saveReview({
  pr,
  sha,
  title = "",
  recommendation = "Review completed",
  summary = "",
  reportContent = "",
  status = STATUS_OPEN,
  cacheDir = getDefaultCacheDir(),
}) {
  assertValidSha(sha);

  const prNum = parsePRNumber(pr);
  if (!prNum) {
    throw new Error(
      "Cannot save review without a PR number. Local-branch reviews are not cached.",
    );
  }

  mkdirSync(cacheDir, { recursive: true });

  // 1. Save full findings markdown by commit ID
  const absolutePath = reportFilePath(cacheDir, sha);
  writeFileSync(absolutePath, reportContent, "utf-8");

  // 2. Update cache.json
  const cache = loadCache(cacheDir);
  const prKey = String(prNum);

  cache.reviews[prKey] = {
    pr: prNum,
    headSha: sha,
    title: title || cache.reviews[prKey]?.title || "",
    recommendation,
    summary,
    status,
    reviewedAt: new Date().toISOString(),
  };

  writeCache(cache, cacheDir);

  return {
    success: true,
    pr: prNum,
    headSha: sha,
    status,
    reportPath: absolutePath,
    recommendation,
    summary,
  };
}

/**
 * Refresh the merge status of every cached entry against the remote.
 *
 * Replaces the earlier prune-on-merge behavior: nothing is deleted, so a review
 * of a merged PR stays available for later regression archaeology. Entries whose
 * lookup fails keep their existing status rather than being guessed at.
 */
export async function syncCache({
  repo = "uswds/uswds",
  cacheDir = getDefaultCacheDir(),
  fetchPRInfoFn = fetchPRInfo,
  execFn = execCmd,
  concurrency = 5,
}) {
  const cache = loadCache(cacheDir);
  const entries = Object.values(cache.reviews || {});
  const merged = [];
  const open = [];
  const unreachable = [];

  for (let i = 0; i < entries.length; i += concurrency) {
    const chunk = entries.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(async (entry) => {
        const prNum = parsePRNumber(entry.pr);
        if (!prNum) {
          unreachable.push({ pr: entry.pr, headSha: entry.headSha });
          return;
        }

        try {
          const prInfo = await fetchPRInfoFn(prNum, repo, execFn);
          const isMerged = isMergedPR(prInfo);
          const nextStatus = isMerged ? STATUS_MERGED : STATUS_OPEN;
          const changed = entry.status !== nextStatus;

          entry.status = nextStatus;
          entry.title = entry.title || prInfo.title || "";
          if (isMerged) {
            entry.mergedAt = prInfo.mergedAt || entry.mergedAt || null;
            merged.push({
              pr: prNum,
              headSha: entry.headSha,
              title: entry.title,
              changed,
            });
          } else {
            delete entry.mergedAt;
            open.push({ pr: prNum, headSha: entry.headSha, changed });
          }
        } catch {
          // Network/auth failure must not rewrite state we can't verify.
          unreachable.push({ pr: prNum, headSha: entry.headSha });
        }
      }),
    );
  }

  writeCache(cache, cacheDir);

  const changedCount = [...merged, ...open].filter((e) => e.changed).length;

  return {
    mergedCount: merged.length,
    openCount: open.length,
    unreachableCount: unreachable.length,
    changedCount,
    merged,
    open,
    unreachable,
    totalCount: Object.keys(cache.reviews || {}).length,
  };
}

export const HELP_TEXT = `USWDS Code Review Cache Tool

Usage:
  node review-cache.mjs check --pr <number|url> [--sha <hash>] [--offline] [--repo <owner/repo>] [--json]
  node review-cache.mjs save --pr <number> --sha <hash> --recommendation <text> --summary <text> [--report-file <file> | --report-text <md>] [--title <text>]
  node review-cache.mjs sync [--repo <owner/repo>] [--json]
  node review-cache.mjs list [--json]

Exit codes for check:
  0  CACHED  — already reviewed at this commit
  1  MISS    — review needed
  2  MERGED  — PR is merged; prior review (if any) is retained
  3  ERROR   — could not determine state

Options:
  --cache-dir <dir>   Cache directory path (defaults to .review-cache)
  --report-file <f>   Read findings markdown from a file ("-" for stdin)
  --report-text <md>  Use the argument itself as the findings markdown
  --offline           Skip the gh lookup and trust --sha (requires --sha)
  --json              Output raw JSON
  --force             Ignore cache on check
  --rec <text>        Alias for --recommendation

Note: only PR reviews are cached; --pr is required for check and save.
`;

const useColor = Boolean(process.stdout.isTTY && !process.env.NO_COLOR);
const color = {
  green: (s) => (useColor ? `\x1b[32m${s}\x1b[0m` : s),
  yellow: (s) => (useColor ? `\x1b[33m${s}\x1b[0m` : s),
  red: (s) => (useColor ? `\x1b[31m${s}\x1b[0m` : s),
  cyan: (s) => (useColor ? `\x1b[36m${s}\x1b[0m` : s),
};

const CHECK_BADGES = {
  [CHECK_STATUS.CACHED]: () => color.green("[CACHE HIT]"),
  [CHECK_STATUS.MERGED]: () => color.yellow("[MERGED]"),
  [CHECK_STATUS.ERROR]: () => color.red("[ERROR]"),
  [CHECK_STATUS.MISS]: () => color.cyan("[CACHE MISS]"),
};

/** Print `label: value`, skipping fields the saved review never filled in. */
function printField(label, value) {
  if (value) console.log(`${label}: ${value}`);
}

function printCachedReview(result, reportLabel) {
  printField("Recommendation", result.recommendation);
  printField("Summary", result.summary);
  console.log(
    `${reportLabel}: ${result.reportPath}${result.reportExists ? "" : " (MISSING ON DISK)"}`,
  );
}

function printCheckResult(result) {
  const badgeFn = CHECK_BADGES[result.status] || CHECK_BADGES[CHECK_STATUS.MISS];
  const out = result.status === CHECK_STATUS.ERROR ? console.error : console.log;
  out(`${badgeFn()} ${result.message}`);

  if (result.status === CHECK_STATUS.CACHED) {
    printCachedReview(result, "Full report");
  } else if (result.status === CHECK_STATUS.MERGED && result.cached) {
    printCachedReview(result, "Retained report");
  }
}

/** Pluralize `count` of `singular`, e.g. `pluralize(1, "item")` -> "item". */
function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

function formatDateOnly(isoString) {
  if (!isoString) return "-";
  try {
    return new Date(isoString).toISOString().split("T")[0];
  } catch {
    return isoString;
  }
}

export function parseCliArgs(rawArgs) {
  // Check for ambiguous --report before standard parsing
  if (rawArgs.includes("--report")) {
    throw new Error(
      "Error: --report is ambiguous. Use --report-file <path> (or '-' for stdin), or --report-text <markdown>.",
    );
  }

  const { values, positionals } = parseArgs({
    args: rawArgs,
    allowPositionals: true,
    strict: false,
    options: {
      pr: { type: "string" },
      sha: { type: "string" },
      repo: { type: "string", default: "uswds/uswds" },
      recommendation: { type: "string" },
      rec: { type: "string" },
      summary: { type: "string" },
      title: { type: "string" },
      "report-file": { type: "string" },
      "report-text": { type: "string" },
      "cache-dir": { type: "string" },
      json: { type: "boolean", default: false },
      force: { type: "boolean", default: false },
      offline: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });

  return {
    command: positionals[0],
    options: {
      ...values,
      recommendation: values.recommendation || values.rec,
      reportFile: values["report-file"],
      reportText: values["report-text"],
      cacheDir: resolve(values["cache-dir"] || getDefaultCacheDir()),
    },
  };
}

/** Resolve the findings markdown a `save` should persist. */
function readReportContent({ reportFile, reportText }) {
  if (reportFile && reportText !== undefined) {
    throw new Error("Error: pass only one of --report-file or --report-text.");
  }
  if (!reportFile) {
    return reportText ?? "";
  }
  if (reportFile === "-") {
    return readFileSync(0, "utf-8");
  }
  if (!existsSync(reportFile)) {
    // Never silently fall back to treating the path as content: a typo would
    // otherwise be cached as a valid review whose body is the filename.
    throw new Error(
      `Error: report file not found: ${reportFile}. Use --report-text for inline markdown.`,
    );
  }
  return readFileSync(reportFile, "utf-8");
}

function outputResult(options, result, printHumanFn, exitCode = 0) {
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printHumanFn?.(result);
  }
  return { exitCode, result };
}

export async function runCheck(options) {
  if (!options.pr) {
    throw new Error(
      "Error: --pr is required for check. Local-branch reviews are not cached.",
    );
  }

  if (options.force) {
    return outputResult(
      options,
      {
        status: "FORCED_MISS",
        pr: options.pr,
        message: "Forced review bypass",
      },
      () => console.log(`Forced cache bypass for PR #${options.pr}.`),
      CHECK_EXIT_CODES[CHECK_STATUS.MISS],
    );
  }

  const result = await checkReview(options);
  return outputResult(
    options,
    result,
    printCheckResult,
    CHECK_EXIT_CODES[result.status] ?? 3,
  );
}

export function runSave(options) {
  const result = saveReview({
    ...options,
    reportContent: readReportContent(options),
  });

  return outputResult(options, result, () => {
    console.log(
      `Saved review for PR #${result.pr} (${shortSha(result.headSha)}) to ${result.reportPath}`,
    );
  });
}

export async function runSync(options) {
  const result = await syncCache(options);

  return outputResult(options, result, () => {
    console.log(
      `Synced ${result.totalCount} cached reviews: ${result.openCount} open, ${result.mergedCount} merged, ${result.unreachableCount} unreachable.`,
    );
    for (const item of result.merged.filter((entry) => entry.changed)) {
      console.log(`  - #${item.pr} now merged: ${item.title || item.headSha}`);
    }
  });
}

export function runList(options) {
  const cache = loadCache(options.cacheDir);

  return outputResult(options, cache, () => {
    const entries = Object.values(cache.reviews || {});
    console.log(
      `Cached reviews (${entries.length} ${pluralize(entries.length, "item")}):`,
    );
    for (const item of entries) {
      console.log(
        `  PR #${item.pr || "?"} [${shortSha(item.headSha)}] (${item.status || STATUS_OPEN}) - ${item.recommendation || "Reviewed"} (${formatDateOnly(item.reviewedAt)})`,
      );
      if (item.summary) {
        console.log(`      ${item.summary}`);
      }
    }
  });
}

export const COMMANDS = {
  check: runCheck,
  save: runSave,
  sync: runSync,
  list: runList,
};

export async function main(rawArgs = process.argv.slice(2)) {
  let parsed;
  try {
    parsed = parseCliArgs(rawArgs);
  } catch (err) {
    console.error(err.message);
    return 1;
  }

  const { command, options } = parsed;

  if (!command || options.help) {
    console.log(HELP_TEXT);
    return 0;
  }

  const run = COMMANDS[command];
  if (!run) {
    console.error(`Unknown command: ${command}`);
    return 1;
  }

  try {
    const { exitCode = 0 } = await run(options);
    return exitCode;
  } catch (err) {
    console.error(err.message);
    return 1;
  }
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  main().then((code) => {
    process.exit(code);
  }).catch((err) => {
    console.error("Fatal error in review-cache:", err.message);
    process.exit(1);
  });
}
