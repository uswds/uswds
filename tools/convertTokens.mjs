/*
 * convertTokens.mjs
 * ----------------------------------------
 * Orchestrates DTCG token generation from the USWDS Sass source of truth.
 * Run with: npm run tokens:build
 *
 * Each entry maps a Sass source file to an output JSON file and its DTCG
 * `$type`. Color families are globbed. Files that are not clean design tokens
 * are intentionally omitted (see OMITTED below) and tracked as follow-up work.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import { writeTokenFile } from "./sassToJson.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const TOKENS_SRC = "packages/uswds-core/src/styles/tokens";

// Non-color sources. `group` is the DTCG namespace the tokens nest under (keeps
// the merged tree collision-free); `type` is the DTCG $type for that group.
export const SOURCES = [
  // --- units ---
  {
    src: `${TOKENS_SRC}/units/spacing.scss`,
    out: "tokens/units/spacing.json",
    group: "spacing",
    type: "dimension",
  },
  {
    src: `${TOKENS_SRC}/units/spacing-em.scss`,
    out: "tokens/units/spacing-em.json",
    group: "spacing-em",
    type: "dimension",
  },
  {
    src: `${TOKENS_SRC}/units/breakpoints.scss`,
    out: "tokens/units/breakpoints.json",
    group: "breakpoint",
    type: "dimension",
  },
  {
    src: `${TOKENS_SRC}/units/grid-base.scss`,
    out: "tokens/units/grid-base.json",
    group: "grid-base",
    type: "dimension",
  },
  {
    src: `${TOKENS_SRC}/units/input-widths.scss`,
    out: "tokens/units/input-widths.json",
    group: "input-width",
    type: "dimension",
  },
  // --- font ---
  {
    src: `${TOKENS_SRC}/font/type-scale.scss`,
    out: "tokens/font/type-scale.json",
    group: "font-size",
    type: "dimension",
  },
  {
    src: `${TOKENS_SRC}/font/line-height.scss`,
    out: "tokens/font/line-height.json",
    group: "line-height",
    type: "number",
  },
  {
    src: `${TOKENS_SRC}/font/measure.scss`,
    out: "tokens/font/measure.json",
    group: "measure",
    type: "dimension",
  },
  {
    src: `${TOKENS_SRC}/font/base-cap-height.scss`,
    out: "tokens/font/base-cap-height.json",
    group: "cap-height",
    type: "dimension",
  },
  {
    src: `${TOKENS_SRC}/font/stacks.scss`,
    out: "tokens/font/stacks.json",
    group: "font-family",
    type: "fontFamily",
    family: "fontFamily",
  },
  // --- radius (computed; source lives outside tokens/) ---
  {
    src: "packages/uswds-core/src/styles/variables/border-radius.scss",
    out: "tokens/radius/radius.json",
    group: "radius",
    type: "dimension",
  },
];

// Sources intentionally omitted from this pass, with rationale:
//   font/typefaces.scss       – composite config (display-name/cap-height/stack/
//                               system-font per face), incl. booleans + null; no
//                               single DTCG $type. Needs a composite-type design.
//   units/column-gaps.scss    – values are spacing-token *keys*, not dimensions.
//   units/layout-grid-widths  – 12-column *percentages*; DTCG dimension is px/rem.
//   units/neg-prefix.scss     – a string constant used for interpolation, not a token.
//   opacity                   – no stored token map; the utility opacity scale is
//                               a computed 0–100 range, not a source-of-truth map.
const OMITTED = [
  "typefaces",
  "column-gaps",
  "layout-grid-widths",
  "neg-prefix",
  "opacity",
];

export async function colorSources() {
  const files = await glob(`${TOKENS_SRC}/color/_*.scss`, { cwd: REPO_ROOT });
  return files
    .filter((f) => !f.endsWith("_index.scss"))
    .map((f) => {
      const name = path
        .basename(f)
        .replace(/^_/, "")
        .replace(/\.scss$/, "");
      // All families nest under one shared `color` group; Style Dictionary
      // deep-merges them into color.gold, color.blue, … (no collisions).
      return {
        src: f,
        out: `tokens/color/${name}.json`,
        group: "color",
        type: "color",
      };
    });
}

async function run() {
  const sources = [...(await colorSources()), ...SOURCES];
  let total = 0;
  for (const entry of sources) {
    try {
      const { out, count } = await writeTokenFile(entry);
      total += count;
      console.info(`  ✓ ${out}  (${count} tokens)`);
    } catch (err) {
      console.error(`  ✗ ${entry.src}\n    ${err.message.split("\n")[0]}`);
      process.exitCode = 1;
    }
  }
  console.info(`\nGenerated ${sources.length} token files, ${total} tokens.`);
  console.info(`Intentionally omitted: ${OMITTED.join(", ")}.`);
}

// Only generate when run directly (`npm run tokens:build`); importing this
// module (e.g. from the drift test) must not have side effects.
if (import.meta.url === `file://${process.argv[1]}`) run();
