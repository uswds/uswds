import assert from "node:assert/strict";
import { test } from "node:test";
import { needsFullVerification } from "./ci-scope.mjs";

test("documentation-only changes retain fast checks and skip expensive jobs", () => {
  assert.equal(
    needsFullVerification(["README.md", "docs/releasing.md"]),
    false,
  );
});
test("shared code, dependencies, fixtures, and unknown paths run full verification", () => {
  for (const path of [
    "package-lock.json",
    ".storybook/test-runner.js",
    "packages/uswds-core/_index.scss",
    "tasks/sass.js",
    ".github/workflows/ci.yml",
    "new-file",
    "docs/example.js",
  ]) {
    assert.equal(needsFullVerification(["README.md", path]), true, path);
  }
  assert.equal(needsFullVerification([]), true);
});
