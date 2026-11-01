import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sassTaskPath = require.resolve("./sass.js");
const gulpPath = require.resolve("gulp");
const { version } = require("../package.json");

describe("Sass build task", function () {
  this.timeout(30000);
  let fixture;

  beforeEach(() => {
    fixture = fs.mkdtempSync(path.join(os.tmpdir(), "uswds-sass-task-"));
    fs.mkdirSync(path.join(fixture, "src/stylesheets"), { recursive: true });
    fs.mkdirSync(path.join(fixture, "packages/fixture"), { recursive: true });
    fs.writeFileSync(
      path.join(fixture, "packages/fixture/_index.scss"),
      ".compile-fixture { color: #123456; padding: 1px 2px; }",
    );
  });

  afterEach(() => fs.rmSync(fixture, { recursive: true, force: true }));

  function writeEntry(contents) {
    fs.writeFileSync(
      path.join(fixture, "src/stylesheets/uswds.scss"),
      contents,
    );
  }

  function runTasks(tasks) {
    return spawnSync(
      process.execPath,
      [
        "-e",
        `
          const gulp = require(${JSON.stringify(gulpPath)});
          const { compileSass, compileSassForWatch } = require(${JSON.stringify(sassTaskPath)});
          gulp.on("error", () => {});
          gulp.series(${tasks})((error) => {
            if (error) {
              console.error(error.message);
              process.exitCode = 1;
            }
          });
        `,
      ],
      { cwd: fixture, encoding: "utf8", timeout: 15000 },
    );
  }

  it("stops subsequent tasks for invalid Sass and emits no CSS", () => {
    writeEntry(".broken { color: $missing-variable; }");
    const result = runTasks(`
      compileSass,
      function nextTask(done) {
        require("node:fs").writeFileSync("next-task-ran", "unexpected");
        done();
      }
    `);

    assert.ifError(result.error);
    assert.notEqual(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stderr, /Undefined variable/);
    assert.equal(fs.existsSync(path.join(fixture, "next-task-ran")), false);
    assert.equal(
      fs.existsSync(path.join(fixture, "dist/css/uswds.css")),
      false,
    );
    assert.equal(
      fs.existsSync(path.join(fixture, "dist/css/uswds.min.css")),
      false,
    );
  });

  it("writes expanded/minified CSS, the package version, and a source map", () => {
    writeEntry('/*! uswds @version */\n@use "fixture";');
    const result = runTasks("compileSass");

    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const css = fs.readFileSync(
      path.join(fixture, "dist/css/uswds.css"),
      "utf8",
    );
    const minified = fs.readFileSync(
      path.join(fixture, "dist/css/uswds.min.css"),
      "utf8",
    );
    assert.match(css, /\.compile-fixture\s*\{/);
    assert.ok(css.includes(`uswds v${version}`));
    assert.ok(minified.includes(`uswds v${version}`));
    assert.match(
      minified,
      /\.compile-fixture\{color:#123456;padding:1px 2px\}/,
    );
    const sourceMap = JSON.parse(
      fs.readFileSync(path.join(fixture, "dist/css/uswds.min.css.map"), "utf8"),
    );
    assert.ok(
      sourceMap.sources.some((source) => source.endsWith("_index.scss")),
    );
  });

  it("reports a failed watch edit and compiles the next valid edit", () => {
    writeEntry(".broken { color: $missing-variable; }");
    const result = runTasks(`
      compileSassForWatch,
      function repair(done) {
        require("node:fs").writeFileSync(
          "src/stylesheets/uswds.scss",
          '@use "fixture";'
        );
        done();
      },
      compileSassForWatch
    `);

    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout + result.stderr, /Undefined variable/);
    assert.match(
      fs.readFileSync(path.join(fixture, "dist/css/uswds.css"), "utf8"),
      /\.compile-fixture/,
    );
  });
});
