import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
const { verifySpecCount } = require("./test.js");

describe("test discovery guard", () => {
  let cwd;
  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "uswds-spec-discovery-"));
    mkdirSync(join(cwd, "specs"));
    ["one.spec.js", "two.spec.mjs", "three.spec.cjs"].forEach((file) => {
      writeFileSync(join(cwd, "specs", file), "");
    });
  });
  afterEach(() => rmSync(cwd, { recursive: true, force: true }));

  it("counts all supported extensions selected by the runner", async () => {
    assert.equal(
      await verifySpecCount([["specs/*.spec.{js,mjs,cjs}"]], 3, { cwd }),
      3,
    );
  });

  it("fails when a runner exclusion silently drops a spec", async () => {
    await assert.rejects(
      verifySpecCount(
        [["specs/*.spec.{js,mjs,cjs}", "!specs/two.spec.mjs"]],
        3,
        {
          cwd,
        },
      ),
      /Spec count \(2\) dropped below the floor of 3/,
    );
  });

  it("does not let duplicate globs inflate coverage", async () => {
    await assert.rejects(
      verifySpecCount([["specs/*.spec.js", "specs/one.spec.js"]], 2, { cwd }),
      /Spec count \(1\)/,
    );
  });

  it("includes a separate runner's specs despite another runner's exclusion", async () => {
    assert.equal(
      await verifySpecCount(
        [
          ["specs/*.spec.{js,mjs,cjs}", "!specs/two.spec.mjs"],
          ["specs/two.spec.mjs"],
        ],
        3,
        { cwd },
      ),
      3,
    );
  });

  it("runs the guard first in both public test entry points", () => {
    const tree = JSON.parse(
      execFileSync(
        process.execPath,
        [join(dirname(require.resolve("gulp")), "bin/gulp.js"), "--tasks-json"],
        { encoding: "utf8" },
      ),
    );
    ["test", "unitTests"].forEach((name) => {
      const task = tree.nodes.find((entry) => entry.label === name);
      assert.equal(task.nodes[0].nodes[0].label, "checkSpecCount");
    });
  });
});
