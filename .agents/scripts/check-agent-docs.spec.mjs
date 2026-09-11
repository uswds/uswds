import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DOC_FILES,
  checkAgentDocs,
  frontmatterName,
  inlineCodeSpans,
  pathExists,
  referencedGulpTasks,
  referencedNpmScripts,
  referencedPaths,
  stripFencedBlocks,
} from "./check-agent-docs.mjs";

describe("check-agent-docs", () => {
  describe("stripFencedBlocks", () => {
    it("drops fenced examples so they are not read as claims", () => {
      const md = "keep `a`\n```sh\nnpm run not-real\n```\nkeep `b`";
      const stripped = stripFencedBlocks(md);
      assert.ok(!stripped.includes("not-real"));
      assert.ok(stripped.includes("`a`"));
      assert.ok(stripped.includes("`b`"));
    });
  });

  describe("inlineCodeSpans", () => {
    it("collects single-backtick spans", () => {
      assert.deepEqual(inlineCodeSpans("run `npm test` then `gulp test`"), [
        "npm test",
        "gulp test",
      ]);
    });

    it("ignores spans inside fenced blocks", () => {
      assert.deepEqual(inlineCodeSpans("```\n`inside`\n```\n`outside`"), [
        "outside",
      ]);
    });
  });

  describe("referencedNpmScripts", () => {
    it("finds run scripts and the bare test and start aliases", () => {
      const found = referencedNpmScripts([
        "npm run test:unit",
        "npm test",
        "npm start",
        "npm run fix:icons",
      ]);
      assert.deepEqual(found.sort(), [
        "fix:icons",
        "start",
        "test",
        "test:unit",
      ]);
    });

    it("ignores spans that merely mention npm", () => {
      assert.deepEqual(
        referencedNpmScripts(["npm", "package.json", "npmrc"]),
        [],
      );
    });
  });

  describe("referencedGulpTasks", () => {
    it("finds tasks with and without the npx prefix", () => {
      assert.deepEqual(
        referencedGulpTasks(["gulp typecheck", "npx gulp cleanDist"]).sort(),
        ["cleanDist", "typecheck"],
      );
    });
  });

  describe("referencedPaths", () => {
    const topLevel = new Set(["packages", "gulpfile.js", ".nvmrc", "tasks"]);

    it("accepts paths rooted at a real top-level entry", () => {
      const found = referencedPaths(
        ["packages/usa-button/src/index.js", "gulpfile.js", ".nvmrc"],
        topLevel,
      );
      assert.deepEqual(found.sort(), [
        ".nvmrc",
        "gulpfile.js",
        "packages/usa-button/src/index.js",
      ]);
    });

    it("rejects identifiers and prose that are not paths", () => {
      assert.deepEqual(
        referencedPaths(
          ["const", "sinon", "window.uswdsPresent", "==="],
          topLevel,
        ),
        [],
      );
    });

    it("skips placeholders and globs as illustrative", () => {
      assert.deepEqual(
        referencedPaths(
          ["packages/<component>/", "tasks/*.js", "packages/uswds-core/**"],
          topLevel,
        ),
        [],
      );
    });

    it("skips urls and absolute paths", () => {
      assert.deepEqual(
        referencedPaths(
          ["https://example.gov/x", "/etc/hosts", "~/.claude"],
          topLevel,
        ),
        [],
      );
    });

    it("normalizes a leading ./ and a trailing slash", () => {
      assert.deepEqual(referencedPaths(["./packages/", "tasks/"], topLevel), [
        "packages",
        "tasks",
      ]);
    });
  });

  describe("pathExists", () => {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

    it("resolves a root-relative path", () => {
      assert.equal(pathExists(root, "gulpfile.js", []), true);
    });

    it("resolves a package-relative src path against any package", () => {
      assert.equal(
        pathExists(root, "src/usa-accordion.twig", ["usa-accordion"]),
        true,
      );
    });

    it("does not apply the package fallback outside src/", () => {
      assert.equal(pathExists(root, "_index.scss", ["usa-accordion"]), false);
    });

    it("reports a genuinely missing path", () => {
      assert.equal(
        pathExists(root, "src/nope-not-real.twig", ["usa-accordion"]),
        false,
      );
    });
  });

  describe("frontmatterName", () => {
    it("reads the name field", () => {
      assert.equal(frontmatterName("---\nname: a-skill\n---\n# Hi"), "a-skill");
    });

    it("returns null when there is no frontmatter", () => {
      assert.equal(frontmatterName("# Hi"), null);
    });
  });

  describe("the repo itself", () => {
    it("has agent docs that match the repo", () => {
      const problems = checkAgentDocs();
      assert.deepEqual(
        problems,
        [],
        `Agent docs are out of date:\n  - ${problems.join("\n  - ")}`,
      );
    });

    it("checks at least AGENTS.md", () => {
      assert.ok(DOC_FILES.includes("AGENTS.md"));
    });
  });
});
