/*
 * sassToJson.mjs
 * ----------------------------------------
 * Generate W3C Design Tokens Community Group (DTCG) JSON from the USWDS Sass
 * token source of truth. Values are read by *compiling* the Sass (via
 * get-sass-vars), so function- and math-computed tokens (e.g.
 * `spacing-multiple(2)`, `100% * math.div(1, 12)`) resolve to their final
 * values rather than being copied by hand.
 *
 * ESM-only: get-sass-vars and style-dictionary are ESM, and this repo's root
 * package is CommonJS, so this tool uses the `.mjs` extension.
 */
import path from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import sassVars from "get-sass-vars";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

/**
 * Compile a Sass file and return its top-level variables as a plain object.
 * loadPaths includes the file's own directory so that token files with
 * relative `@use` (spacing, breakpoints, radius, …) resolve their imports.
 */
async function extractSassVars(absScssPath) {
  const scss = await fs.readFile(absScssPath, "utf-8");
  return sassVars(scss, {
    sassOptions: {
      loadPaths: [
        path.dirname(absScssPath), // <-- resolves sibling/relative @use
        path.resolve(REPO_ROOT, "packages/uswds/"),
        path.resolve(REPO_ROOT, "packages/"),
      ],
    },
  });
}

/**
 * Recursively convert a compiled Sass value into DTCG `{ $value }` leaves.
 * Keeps both strings AND numbers (unitless tokens such as line-height are
 * numbers; the draft pipeline dropped them). Skips `null`/`false`, which Sass
 * uses to mark intentionally-absent grades (e.g. `gold-vivid-90`).
 */
function toDtcgLeaves(value) {
  if (value !== null && typeof value === "object") {
    const out = {};
    for (const [key, child] of Object.entries(value)) {
      const leaf = toDtcgLeaves(child);
      if (leaf !== undefined) out[key] = leaf;
    }
    return out;
  }
  if (value === null || value === false) return undefined;
  return { $value: String(value) };
}

/** Split a Sass font stack ("Georgia", serif) into a DTCG fontFamily array. */
function toFontFamily(rawValue) {
  return {
    $value: String(rawValue)
      .split(",")
      .map((f) => f.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean),
  };
}

/** Longest shared `-`-delimited prefix across a set of names. */
function commonPrefix(names) {
  if (names.length < 2) return "";
  const split = names.map((n) => n.split("-"));
  const first = split[0];
  let i = 0;
  for (; i < first.length; i += 1) {
    if (!split.every((parts) => parts[i] === first[i])) break;
  }
  return i ? `${first.slice(0, i).join("-")}-` : "";
}

/**
 * Build the token group for one source file from its compiled Sass vars.
 * Two shapes are supported:
 *  - a single map-valued variable (`$system-spacing: (...)`) → the map's keys
 *    become the tokens (the `$`-var name is dropped);
 *  - several scalar variables (`$system-measure-small: 60ex; …`) → each becomes
 *    a token, named by stripping their shared prefix.
 */
function buildGroup(rawVars, { family } = {}) {
  const keys = Object.keys(rawVars);
  const leafFor = (v) => (family ? toFontFamily(v) : toDtcgLeaves(v));

  if (keys.length === 1) {
    const only = rawVars[keys[0]];
    if (only !== null && typeof only === "object" && !family) {
      return toDtcgLeaves(only); // unwrap the single map var
    }
    // single scalar: name it after the variable, minus a leading `$system-`/`$`
    const name = keys[0].replace(/^\$(system-)?/, "");
    return { [name]: leafFor(only) };
  }

  // multiple top-level vars: strip their shared prefix to form token names
  const bare = keys.map((k) => k.replace(/^\$/, ""));
  const prefix = commonPrefix(bare);
  const group = {};
  keys.forEach((k, i) => {
    const name = bare[i].slice(prefix.length) || bare[i];
    group[name] = leafFor(rawVars[k]);
  });
  return group;
}

/**
 * Convert one Sass source file to a DTCG token object, namespaced under a
 * category group so the merged token tree stays collision-free (e.g.
 * `spacing.small.2`, `font-size.1`, `line-height.3`). $type is set on the
 * group; DTCG children inherit it.
 * @param {object} opts
 * @param {string} opts.src    repo-relative path to the .scss source
 * @param {string} opts.group  category group key the tokens nest under
 * @param {string} opts.type   DTCG $type for the group (children inherit)
 * @param {string} [opts.family] set to "fontFamily" to emit array values
 */
export async function convertFile({ src, group, type, family }) {
  const abs = path.resolve(REPO_ROOT, src);
  const rawVars = await extractSassVars(abs);
  const tokens = buildGroup(rawVars, { family });
  // Single-value source (e.g. grid-base, base-cap-height): make the group node
  // the token itself, so the name is `grid-base` not `grid-base-<var-name>`.
  const keys = Object.keys(tokens);
  if (keys.length === 1 && tokens[keys[0]] && "$value" in tokens[keys[0]]) {
    return { [group]: { $type: type, $value: tokens[keys[0]].$value } };
  }
  return { [group]: { $type: type, ...tokens } };
}

export async function writeTokenFile({ src, out, group, type, family }) {
  const token = await convertFile({ src, group, type, family });
  const abs = path.resolve(REPO_ROOT, out);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, `${JSON.stringify(token, null, 2)}\n`);
  const count = JSON.stringify(token).match(/"\$value"/g)?.length ?? 0;
  return { out, count };
}
