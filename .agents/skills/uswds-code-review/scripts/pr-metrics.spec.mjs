/**
 * Unit tests for the diff-fetching path in pr-metrics.
 *
 * Exercises:
 *  - A `gh` child killed by its own timeout never yields a truncated diff
 *  - Fallback to the REST API when `gh` fails, and no fallback when it succeeds
 *  - Diffs larger than `execFile`'s 1 MB default stdout buffer
 *
 * `fetchPRDiff` takes its exec helper as an argument so these tests can drive
 * the real `execCmd` against a local `bash` stand-in instead of reaching the
 * network. The timeout cases run a command that prints part of a diff and then
 * hangs, which is what a slow `gh pr diff` looks like from here: the child is
 * SIGKILLed with output already buffered. Each case keeps the `curl` branch
 * resolving, so a regression surfaces as the wrong diff rather than as the
 * `process.exit(1)` that a total fetch failure would take down the run with.
 *
 * Like review-cache.spec.mjs, this spec is NOT part of `gulp test`: it covers
 * agent tooling, not shipped library code. Run it by hand:
 *
 *   npm run test:agents
 *   npm run test:agents -- --grep fetchPRDiff
 */

import assert from "node:assert";

import { fetchPRDiff } from "./pr-metrics.mjs";
import { execCmd } from "./review-cache.mjs";

const PR_URL = "https://github.com/uswds/uswds/pull/1";

/** What a timed-out `gh` has already flushed when it gets killed. */
const PARTIAL = "diff --git a/partial b/partial";

/** The complete diff the REST fallback returns once `gh` is rejected. */
const COMPLETE = "diff --git a/complete b/complete\n--- a/complete\n";

/** Emit one diff line, then outlive the timeout the caller passes. */
function hang(opts) {
  return execCmd("bash", ["-c", `echo '${PARTIAL}'; sleep 5`], {
    ...opts,
    timeout: 300,
  });
}

/** Record which commands ran, so fallback order is assertable. */
function trackingExec(ghHandler) {
  const calls = [];
  const execFn = (cmd, args, opts) => {
    calls.push(cmd);
    return cmd === "gh" ? ghHandler(opts) : Promise.resolve(COMPLETE);
  };
  return { calls, execFn };
}

describe("pr-metrics", () => {
  describe("fetchPRDiff", () => {
    it("does not return a truncated diff when `gh` hits its timeout", async () => {
      // The bug: a SIGKILLed child reports code === null, and treating that as
      // success hands back the bytes that happened to arrive as a whole diff.
      const { calls, execFn } = trackingExec(hang);

      const diff = await fetchPRDiff(PR_URL, execFn);

      assert.ok(
        !diff.includes("partial"),
        "a timed-out `gh` must not supply the diff",
      );
      assert.strictEqual(diff, COMPLETE);
      assert.deepStrictEqual(calls, ["gh", "curl"]);
    });

    it("falls back to the REST API when `gh` exits non-zero", async () => {
      const { calls, execFn } = trackingExec(() =>
        execCmd("bash", ["-c", "echo boom >&2; exit 3"]),
      );

      assert.strictEqual(await fetchPRDiff(PR_URL, execFn), COMPLETE);
      assert.deepStrictEqual(calls, ["gh", "curl"]);
    });

    it("uses the `gh` diff as-is and skips the fallback", async () => {
      const { calls, execFn } = trackingExec(() =>
        execCmd("bash", ["-c", `echo '${PARTIAL}'`]),
      );

      assert.strictEqual(await fetchPRDiff(PR_URL, execFn), PARTIAL);
      assert.deepStrictEqual(calls, ["gh"]);
    });

    it("reads a diff larger than the 1 MB default stdout buffer", async () => {
      // `execCmd` runs on `execFile`, which rejects past maxBuffer rather than
      // truncating -- so without a raised cap the biggest PRs would silently
      // desert `gh` for the fallback.
      const execFn = (cmd, args, opts) =>
        cmd === "gh"
          ? execCmd(
              "bash",
              ["-c", "echo 'diff --git a/big b/big'; yes x | head -c 2000000"],
              opts,
            )
          : Promise.resolve(COMPLETE);

      const diff = await fetchPRDiff(PR_URL, execFn);

      assert.ok(
        diff.length > 1024 * 1024,
        `expected the whole diff, got ${diff.length} bytes`,
      );
      assert.notStrictEqual(diff, COMPLETE);
    });
  });
});
