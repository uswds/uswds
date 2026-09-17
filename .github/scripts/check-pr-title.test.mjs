import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { checkEvent, isValidTitle } from "./check-pr-title.mjs";

test("accepts documented types, optional scopes, and breaking changes", () => {
  for (const type of [
    "feat",
    "fix",
    "docs",
    "test",
    "ci",
    "build",
    "chore",
    "refactor",
    "perf",
    "style",
    "revert",
  ]) {
    for (const suffix of [
      ": describe the change",
      "(modal): describe the change",
      "!: remove an option",
      "(modal)!: remove an option",
    ]) {
      assert.equal(isValidTitle(type + suffix), true, type + suffix);
    }
  }
  for (const title of [
    "fix(usa-modal): restore focus",
    "chore(deps-dev): bump dependency",
    "docs(core/js): explain initialization",
    "docs: explain café labels",
    "fix: x",
  ]) {
    assert.equal(isValidTitle(title), true, title);
  }
});

test("rejects legacy titles, unknown types, invalid scopes, and whitespace", () => {
  for (const title of [
    undefined,
    null,
    42,
    "",
    "USWDS - Button: Fix focus",
    "feature: add a feature",
    "Fix: correct focus",
    "fix(): correct focus",
    "fix(Modal): correct focus",
    "fix(two words): correct focus",
    "fix(-modal): correct focus",
    "fix:no space",
    "fix:  two spaces",
    "fix: ",
    "fix: trailing ",
    " fix: leading",
    "fix: line\nbreak",
    "fix: trailing\n",
    "fix: carriage\rreturn",
    "fix: tab\tinside",
    "fix: null\0inside",
    "fix: line\u2028break",
    "fix: paragraph\u2029break",
  ]) {
    assert.equal(isValidTitle(title), false, String(title));
  }
});

test("requires a pull request title in the event", () => {
  for (const event of [
    undefined,
    null,
    {},
    { pull_request: {} },
    { pull_request: { title: "invalid" } },
  ]) {
    assert.throws(() => checkEvent(event), /Use type/);
  }
  assert.doesNotThrow(() =>
    checkEvent({ pull_request: { title: "ci: validate titles" } }),
  );
});

test("CLI fails closed on missing or malformed events and treats titles as data", () => {
  const dir = mkdtempSync(join(tmpdir(), "uswds-pr-title-"));
  const eventPath = join(dir, "event.json");
  const script = fileURLToPath(
    new URL("./check-pr-title.mjs", import.meta.url),
  );
  const run = (path) =>
    spawnSync(process.execPath, [script], {
      env: { ...process.env, GITHUB_EVENT_PATH: path },
      encoding: "utf8",
    });
  try {
    writeFileSync(
      eventPath,
      JSON.stringify({
        pull_request: { title: "docs: explain `code` and $(shell) syntax" },
      }),
    );
    assert.equal(run(eventPath).status, 0);
    writeFileSync(
      eventPath,
      JSON.stringify({
        pull_request: { title: "invalid\n::notice::untrusted" },
      }),
    );
    const invalid = run(eventPath);
    assert.equal(invalid.status, 1);
    assert.doesNotMatch(invalid.stdout + invalid.stderr, /::notice::untrusted/);
    writeFileSync(eventPath, "not json");
    assert.equal(run(eventPath).status, 1);
    assert.equal(run(join(dir, "missing.json")).status, 1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
