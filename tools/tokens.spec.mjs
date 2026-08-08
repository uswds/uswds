/*
 * tokens.spec.mjs
 * ----------------------------------------
 * Drift guard: regenerates every token file in-memory from the Sass source of
 * truth and asserts it matches what is committed under tokens/. Fails if the
 * Sass changed without re-running `npm run tokens:build`, or if a JSON file was
 * hand-edited. Also spot-checks that function/math-computed tokens resolve to
 * their final values (the whole reason the values are compiled, not copied).
 */
import assert from "node:assert/strict";
import path from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import { convertFile } from "./sassToJson.mjs";
import { SOURCES, colorSources } from "./convertTokens.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

describe("design token export (DTCG)", () => {
  let sources;

  before(async () => {
    sources = [...(await colorSources()), ...SOURCES];
  });

  it("has manifest entries to check", () => {
    assert.ok(sources.length > 0, "expected token sources in the manifest");
  });

  it("committed JSON matches freshly generated output (no drift)", async () => {
    for (const entry of sources) {
      const generated = await convertFile(entry);
      const committedRaw = await fs.readFile(
        path.resolve(REPO_ROOT, entry.out),
        "utf-8",
      );
      assert.deepEqual(
        generated,
        JSON.parse(committedRaw),
        `${entry.out} is out of date — run \`npm run tokens:build\``,
      );
    }
  });

  it("resolves function- and math-computed values", async () => {
    const spacing = await convertFile(
      sources.find((s) => s.out.endsWith("units/spacing.json")),
    );
    // spacing-multiple(2) => 1rem
    assert.equal(spacing.spacing.small["2"].$value, "1rem");

    const breakpoints = await convertFile(
      sources.find((s) => s.out.endsWith("breakpoints.json")),
    );
    // map-collect of spacing large/larger/largest resolves to rem
    assert.equal(breakpoints.breakpoint.desktop.$value, "64rem");
  });

  it("keeps unitless numeric tokens (line-height) and drops false grades", async () => {
    const lh = await convertFile(
      sources.find((s) => s.out.endsWith("line-height.json")),
    );
    assert.equal(lh["line-height"]["3"].$value, "1.35");

    const gold = await convertFile(
      sources.find((s) => s.out.endsWith("color/gold.json")),
    );
    // gold-vivid-90 is `false` in Sass and must not appear as a token
    assert.ok(
      !("90" in gold.color.gold.vivid),
      "false grade should be dropped",
    );
  });

  it("emits fontFamily tokens as DTCG arrays", async () => {
    const stacks = await convertFile(
      sources.find((s) => s.out.endsWith("stacks.json")),
    );
    assert.ok(Array.isArray(stacks["font-family"].system.$value));
    assert.equal(stacks["font-family"].georgia.$value[0], "Georgia");
  });
});
