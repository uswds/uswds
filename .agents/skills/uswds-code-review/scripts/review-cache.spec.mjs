/**
 * Unit tests for the review-cache tooling in uswds-code-review.
 *
 * Exercises:
 *  - Cache read, write, and schema formatting
 *  - Cache hit on unchanged commit SHA, including report retrieval from disk
 *  - Cache miss / invalidation on new commit SHA
 *  - Markdown report persistence by commit SHA
 *  - Merge status tracking (entries are marked, never deleted)
 *
 * Every test runs against a fresh scratch cache directory. The `save`, `check`,
 * and `sync` fixtures below bind that directory and fill in fields the test
 * under discussion doesn't care about, so each test body shows only what it is
 * actually asserting on. Tests of argument validation call the underlying
 * functions directly, since a defaulting fixture would supply the very
 * argument they check for.
 *
 * This spec is intentionally NOT part of `gulp test`: it covers agent tooling,
 * not shipped library code, so it stays out of the main test config. Run it by
 * hand after changing review-cache.mjs:
 *
 *   npm run test:agents
 *   npm run test:agents -- --grep syncCache
 */

import assert from "node:assert";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

import {
  loadCache,
  writeCache,
  checkReview,
  saveReview,
  syncCache,
  parsePRNumber,
  assertValidSha,
  execCmd,
  parseCliArgs,
  main,
  getDefaultCacheDir,
  assertSafeCacheDir,
  findRepoRoot,
  CACHE_DIR_NAME,
  STATUS_OPEN,
  STATUS_MERGED,
  STATUS_CLOSED,
  CHECK_STATUS,
  CHECK_EXIT_CODES,
} from "./review-cache.mjs";

/** Any merge timestamp; only tests that assert on it need to know the value. */
const MERGED_AT = "2026-08-20T10:00:00Z";

/**
 * A distinct, valid SHA for tests that need *a* commit id but don't assert on
 * it. Unique per call so two saves never collide on one report filename.
 */
let shaCounter = 0;
function nextSha() {
  shaCounter += 1;
  return String(shaCounter).padStart(40, "0");
}

/** A `fetchPRInfo` stub answering with one fixed payload for any PR. */
function stubLookup(payload) {
  return async () => ({ state: "OPEN", ...payload });
}

/** A `fetchPRInfo` stub answering per PR number. */
function stubLookupByPR(byNumber) {
  return async (prNum) => ({ state: "OPEN", ...byNumber[prNum] });
}

/** A `fetchPRInfo` stub that fails, as an unauthenticated `gh` would. */
function stubLookupFailure(message = "gh not authenticated") {
  return async () => {
    throw new Error(message);
  };
}

/**
 * Default lookup for the fixtures: a test that reaches the network has forgotten
 * to stub, and should say so rather than shelling out to the real `gh`.
 */
const stubLookupUnset = stubLookupFailure(
  "fetchPRInfoFn was not stubbed for this test",
);

describe("review-cache", () => {
  let cacheDir;

  beforeEach(async () => {
    cacheDir = await mkdtemp(path.join(tmpdir(), "uswds-review-cache-"));
  });

  afterEach(async () => {
    if (cacheDir && existsSync(cacheDir)) {
      await rm(cacheDir, { recursive: true, force: true });
    }
  });

  /** `saveReview` against the scratch cache, with filler for incidental fields. */
  const save = (overrides = {}) =>
    saveReview({
      sha: nextSha(),
      recommendation: "Approve",
      reportContent: "report",
      ...overrides,
      cacheDir,
    });

  /** `checkReview` against the scratch cache. */
  const check = (overrides = {}) =>
    checkReview({ fetchPRInfoFn: stubLookupUnset, ...overrides, cacheDir });

  /** `syncCache` against the scratch cache. */
  const sync = (overrides = {}) =>
    syncCache({ fetchPRInfoFn: stubLookupUnset, ...overrides, cacheDir });

  const readCache = () => loadCache(cacheDir);
  const cacheJson = () => path.join(cacheDir, "cache.json");
  const reportFile = (sha) => path.join(cacheDir, `${sha}.md`);

  describe("parsePRNumber", () => {
    it("parses numbers, strings, and github URLs", () => {
      assert.strictEqual(parsePRNumber(6767), 6767);
      assert.strictEqual(parsePRNumber("6767"), 6767);
      assert.strictEqual(parsePRNumber("#6767"), 6767);
      assert.strictEqual(
        parsePRNumber("https://github.com/uswds/uswds/pull/6789"),
        6789,
      );
      assert.strictEqual(
        parsePRNumber("https://github.com/uswds/uswds/pull/6789/files"),
        6789,
      );
      assert.strictEqual(parsePRNumber(null), null);
      assert.strictEqual(parsePRNumber("invalid"), null);
    });
  });

  describe("execCmd", () => {
    it("rejects when the child is killed by a signal", async () => {
      // A timed-out `gh` is SIGKILLed and reports code === null. Resolving there
      // would hand back truncated stdout as if the command had succeeded.
      await assert.rejects(
        execCmd("bash", ["-c", "echo partial; sleep 5"], { timeout: 300 }),
        /terminated by signal/,
      );
    });

    it("rejects on a non-zero exit and surfaces stderr", async () => {
      await assert.rejects(
        execCmd("bash", ["-c", "echo boom >&2; exit 3"]),
        /exited with code 3: boom/,
      );
    });

    it("resolves with trimmed stdout on success", async () => {
      assert.strictEqual(await execCmd("bash", ["-c", "echo ok"]), "ok");
    });
  });

  describe("assertValidSha", () => {
    it("accepts short and full hex SHAs", () => {
      assert.strictEqual(assertValidSha("abc1234"), "abc1234");
      assert.strictEqual(
        assertValidSha("e4f1a23b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"),
        "e4f1a23b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f",
      );
    });

    it("rejects a missing SHA", () => {
      assert.throws(() => assertValidSha(null), /sha is required/i);
    });

    it("rejects path traversal and non-hex input", () => {
      // A SHA is interpolated into a cache filename, so `../` must not survive.
      assert.throws(
        () => assertValidSha("../../escaped"),
        /Invalid commit SHA/,
      );
      assert.throws(() => assertValidSha("abc"), /Invalid commit SHA/);
      assert.throws(() => assertValidSha("zzzzzzz"), /Invalid commit SHA/);
    });
  });

  describe("loadCache and writeCache", () => {
    it("returns an empty cache structure if cache.json does not exist", () => {
      const cache = readCache();
      assert.strictEqual(cache.version, 1);
      assert.deepStrictEqual(cache.reviews, {});
    });

    it("writes and reads back cache data accurately", () => {
      writeCache(
        {
          version: 1,
          reviews: {
            6767: {
              pr: 6767,
              headSha: "abc1234567890",
              recommendation: "Request changes",
              summary: "3 blocking issues",
              status: STATUS_OPEN,
              reportPath: ".review-cache/abc1234567890.md",
            },
          },
        },
        cacheDir,
      );

      const loaded = readCache();
      assert.strictEqual(loaded.version, 1);
      assert.ok(loaded.updatedAt);
      assert.strictEqual(loaded.reviews["6767"].headSha, "abc1234567890");
    });

    it("throws when cache.json is corrupted, rather than silently discarding it", () => {
      writeFileSync(cacheJson(), "{ invalid json ");
      assert.throws(() => readCache(), /unreadable/);
    });

    it("does not overwrite a corrupted cache.json when a save is attempted", () => {
      // Regression: loadCache used to swallow a parse failure and return an
      // empty cache, so the next save silently wrote a fresh cache.json over
      // the corrupt one, wiping every prior review with no error at all.
      const corrupt = "{ invalid json ";
      writeFileSync(cacheJson(), corrupt);

      assert.throws(() => save({ pr: 6767 }), /unreadable/);

      assert.strictEqual(readFileSync(cacheJson(), "utf-8"), corrupt);
    });
  });

  describe("saveReview", () => {
    it("saves markdown report named by commit SHA and updates cache.json", () => {
      const sha = "e4f1a23b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f";
      const reportMarkdown =
        "# PR Review: Test PR\n\n### Recommendation\n✅ **Approve**";

      const res = save({
        pr: 6786,
        sha,
        title: "Modal: restore page content",
        recommendation: "Approve",
        summary: "No blockers found; route AT verification.",
        reportContent: reportMarkdown,
      });

      assert.strictEqual(res.success, true);
      assert.strictEqual(res.pr, 6786);
      assert.strictEqual(res.headSha, sha);

      // Verify file written
      assert.ok(
        existsSync(reportFile(sha)),
        "Commit SHA markdown report file must exist",
      );
      assert.strictEqual(
        readFileSync(reportFile(sha), "utf-8"),
        reportMarkdown,
      );

      // Verify cache.json updated
      const cache = readCache();
      assert.ok(cache.reviews["6786"]);
      assert.strictEqual(cache.reviews["6786"].headSha, sha);
      assert.strictEqual(cache.reviews["6786"].recommendation, "Approve");
      assert.strictEqual(cache.reviews["6786"].status, STATUS_OPEN);
    });

    // Argument validation goes through saveReview directly: the `save` fixture
    // defaults the very fields these tests assert are required.
    it("throws an error if commit SHA is omitted", () => {
      assert.throws(() => {
        saveReview({ pr: 6786, summary: "test", cacheDir });
      }, /sha is required/i);
    });

    it("throws if no PR number is given, since local reviews are not cached", () => {
      assert.throws(() => {
        saveReview({
          sha: "abc1234",
          summary: "local branch review",
          cacheDir,
        });
      }, /PR number/i);
    });
  });

  describe("checkReview", () => {
    it("reports CACHED (hit) when PR commit SHA matches cache", async () => {
      const sha = nextSha();
      save({
        pr: 6767,
        sha,
        recommendation: "Request changes",
        summary: "3 blocking issues",
        reportContent: "# Findings",
      });

      const res = await check({
        pr: 6767,
        fetchPRInfoFn: stubLookup({
          number: 6767,
          headRefOid: sha,
          title: "Character count fix",
        }),
      });

      assert.strictEqual(res.status, "CACHED");
      assert.strictEqual(res.pr, 6767);
      assert.strictEqual(res.headSha, sha);
      assert.strictEqual(res.recommendation, "Request changes");
      assert.strictEqual(res.summary, "3 blocking issues");
    });

    it("returns the findings markdown on a hit, in a non-default cacheDir", async () => {
      // Regression: the report path was resolved against cacheDir's *parent*,
      // so a hit under --cache-dir reported CACHED with no findings attached —
      // and the skill skips re-review on a hit, so the findings vanished.
      const sha = nextSha();
      save({
        pr: 6767,
        sha,
        recommendation: "Request changes",
        summary: "3 blocking issues",
        reportContent: "# Findings\n\nB1. Something concrete.",
      });

      const res = await check({ pr: 6767, sha, offline: true });

      assert.strictEqual(res.status, "CACHED");
      assert.strictEqual(res.reportExists, true);
      assert.match(res.reportContent, /B1\. Something concrete\./);
    });

    it("honors --offline by trusting the caller's sha without any lookup", async () => {
      const sha = nextSha();
      save({ pr: 6789, sha, reportContent: "# Findings" });

      // Counted rather than thrown: resolvePRHead catches a failed lookup and
      // falls back to --sha, so a throwing stub would still report CACHED and
      // prove nothing.
      let lookups = 0;
      const countingLookup = async () => {
        lookups += 1;
        return { number: 6789, state: "OPEN", headRefOid: sha };
      };

      const res = await check({
        pr: 6789,
        sha,
        offline: true,
        fetchPRInfoFn: countingLookup,
      });

      assert.strictEqual(res.status, "CACHED");
      assert.strictEqual(lookups, 0, "offline must not touch the network");
    });

    it("errors when offline is set without a sha", async () => {
      const res = await check({ pr: 6789, offline: true });

      assert.strictEqual(res.status, "ERROR");
      assert.match(res.message, /--offline requires --sha/);
    });

    it("errors when no PR number is given", async () => {
      const res = await check({ sha: "abc1234" });

      assert.strictEqual(res.status, "ERROR");
      assert.match(res.message, /PR number is required/);
    });

    it("reports MISS when PR has new commit activity", async () => {
      const oldSha = nextSha();
      const newSha = nextSha();

      save({
        pr: 6767,
        sha: oldSha,
        recommendation: "Request changes",
        summary: "Old findings",
        reportContent: "# Old",
      });

      const res = await check({
        pr: 6767,
        fetchPRInfoFn: stubLookup({
          number: 6767,
          headRefOid: newSha,
          title: "Character count fix",
        }),
      });

      assert.strictEqual(res.status, "MISS");
      assert.strictEqual(res.headSha, newSha);
      assert.strictEqual(res.previousSha, oldSha);
    });

    it("reports MISS when PR is not in cache", async () => {
      const sha = nextSha();

      const res = await check({
        pr: 6789,
        fetchPRInfoFn: stubLookup({
          number: 6789,
          headRefOid: sha,
          title: "Accordion alignment",
        }),
      });

      assert.strictEqual(res.status, "MISS");
      assert.strictEqual(res.headSha, sha);
      assert.strictEqual(res.previousSha, null);
    });

    it("marks a merged PR without deleting its review or report", async () => {
      const sha = nextSha();
      save({
        pr: 6659,
        sha,
        recommendation: "Approve",
        summary: "Clean review",
        reportContent: "# Merged PR findings",
      });

      const res = await check({
        pr: 6659,
        fetchPRInfoFn: stubLookup({
          number: 6659,
          state: "MERGED",
          headRefOid: sha,
          mergedAt: MERGED_AT,
        }),
      });

      assert.strictEqual(res.status, "MERGED");
      assert.strictEqual(res.cached, true);
      assert.strictEqual(res.recommendation, "Approve");

      // The review survives: a merged PR's review is the record you want when a
      // regression surfaces months later.
      const updatedCache = readCache();
      assert.ok(updatedCache.reviews["6659"], "entry must be retained");
      assert.strictEqual(updatedCache.reviews["6659"].status, STATUS_MERGED);
      assert.strictEqual(updatedCache.reviews["6659"].mergedAt, MERGED_AT);
      assert.ok(
        existsSync(reportFile(sha)),
        "findings markdown must be retained",
      );
      assert.match(res.reportContent, /# Merged PR findings/);
    });

    it("reports a merged PR it never reviewed without inventing an entry", async () => {
      const res = await check({
        pr: 6600,
        fetchPRInfoFn: stubLookup({
          number: 6600,
          state: "MERGED",
          headRefOid: nextSha(),
          mergedAt: MERGED_AT,
        }),
      });

      assert.strictEqual(res.status, "MERGED");
      assert.strictEqual(res.cached, false);
      assert.deepStrictEqual(readCache().reviews, {});
    });

    it("marks a closed (unmerged) PR without deleting its review or report", async () => {
      const sha = nextSha();
      save({
        pr: 6652,
        sha,
        recommendation: "Approve",
        reportContent: "# Closed PR findings\n\nNo blockers.",
      });

      const res = await check({
        pr: 6652,
        fetchPRInfoFn: stubLookup({
          number: 6652,
          state: "CLOSED",
          headRefOid: sha,
          closedAt: MERGED_AT,
        }),
      });

      assert.strictEqual(res.status, "CLOSED");
      assert.strictEqual(res.cached, true);
      assert.strictEqual(res.recommendation, "Approve");

      const updatedCache = readCache();
      assert.ok(updatedCache.reviews["6652"], "entry must be retained");
      assert.strictEqual(updatedCache.reviews["6652"].status, STATUS_CLOSED);
      assert.strictEqual(updatedCache.reviews["6652"].closedAt, MERGED_AT);
      assert.ok(
        existsSync(reportFile(sha)),
        "findings markdown must be retained",
      );
    });
  });

  describe("syncCache", () => {
    it("marks merged and closed entries and leaves open ones alone, deleting nothing", async () => {
      // Fixed SHAs: the report filenames are asserted on below.
      save({ pr: 101, sha: "a101101" });
      save({ pr: 102, sha: "b102102", recommendation: "Request changes" });
      save({ pr: 103, sha: "c103103", recommendation: "Approve" });

      const res = await sync({
        fetchPRInfoFn: stubLookupByPR({
          101: { number: 101, state: "MERGED", mergedAt: MERGED_AT },
          102: { number: 102, headRefOid: "b102102" },
          103: { number: 103, state: "CLOSED", closedAt: MERGED_AT },
        }),
      });

      assert.strictEqual(res.mergedCount, 1);
      assert.strictEqual(res.closedCount, 1);
      assert.strictEqual(res.openCount, 1);
      assert.strictEqual(res.totalCount, 3);

      const cache = readCache();
      assert.strictEqual(cache.reviews["101"].status, STATUS_MERGED);
      assert.strictEqual(cache.reviews["102"].status, STATUS_OPEN);
      assert.strictEqual(cache.reviews["103"].status, STATUS_CLOSED);
      assert.ok(existsSync(reportFile("a101101")));
      assert.ok(existsSync(reportFile("b102102")));
      assert.ok(existsSync(reportFile("c103103")));
    });

    it("leaves status untouched when the lookup fails", async () => {
      save({ pr: 103 });

      const res = await sync({ fetchPRInfoFn: stubLookupFailure() });

      assert.strictEqual(res.unreachableCount, 1);
      const cache = readCache();
      assert.ok(cache.reviews["103"], "entry must survive a failed lookup");
      assert.strictEqual(cache.reviews["103"].status, STATUS_OPEN);
    });

    it("handles multiple concurrent lookups accurately", async () => {
      for (let i = 201; i <= 210; i += 1) {
        save({ pr: i, sha: `a000${i}` });
      }

      const byPR = {};
      for (let i = 201; i <= 210; i += 1) {
        byPR[i] = {
          number: i,
          state: i % 2 === 0 ? "MERGED" : "OPEN",
          mergedAt: i % 2 === 0 ? MERGED_AT : undefined,
        };
      }

      const res = await sync({
        fetchPRInfoFn: stubLookupByPR(byPR),
        concurrency: 3,
      });

      assert.strictEqual(res.totalCount, 10);
      assert.strictEqual(res.mergedCount, 5);
      assert.strictEqual(res.openCount, 5);
    });
  });

  describe("parseCliArgs and main CLI dispatcher", () => {
    it("parses check options and aliases", () => {
      const { command, options } = parseCliArgs([
        "check",
        "--pr",
        "6767",
        "--sha",
        "abc1234",
        "--offline",
        "--json",
      ]);
      assert.strictEqual(command, "check");
      assert.strictEqual(options.pr, "6767");
      assert.strictEqual(options.sha, "abc1234");
      assert.strictEqual(options.offline, true);
      assert.strictEqual(options.json, true);
    });

    it("parses save options including alias --rec", () => {
      const { command, options } = parseCliArgs([
        "save",
        "--pr",
        "6767",
        "--sha",
        "abc1234",
        "--rec",
        "Request changes",
        "--summary",
        "some notes",
      ]);
      assert.strictEqual(command, "save");
      assert.strictEqual(options.recommendation, "Request changes");
      assert.strictEqual(options.summary, "some notes");
    });

    it("throws a clear error on ambiguous --report argument", () => {
      assert.throws(
        () => parseCliArgs(["save", "--report", "findings.md"]),
        /--report is ambiguous/,
      );
    });

    it("returns exit code 0 on --help", async () => {
      const code = await main(["--help"]);
      assert.strictEqual(code, 0);
    });

    it("returns exit code 1 on unknown command", async () => {
      const code = await main(["unknown-command"]);
      assert.strictEqual(code, 1);
    });
  });
});
