/*
 * style-dictionary.config.mjs
 * ----------------------------------------
 * Consumes the generated DTCG token JSON (tokens/**\/*.json) and emits SCSS and
 * CSS custom-property builds under build/. Each token is namespaced by its
 * category group, so names are already unique (`--usa-color-gold-20`,
 * `--usa-spacing-small-2`, `--usa-line-height-3`) with a plain kebab name.
 *
 * Values are emitted as-authored (the JSON already holds final, compiled
 * values), so no unit/color re-transforms are applied — that avoids running,
 * say, size/rem against a color token.
 */
import StyleDictionary from "style-dictionary";

// fontFamily $value is a DTCG array; join to a valid CSS font stack.
StyleDictionary.registerTransform({
  name: "value/font-family",
  type: "value",
  transitive: true,
  filter: (token) =>
    token.$type === "fontFamily" && Array.isArray(token.$value),
  transform: (token) =>
    token.$value.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", "),
});

const transforms = ["name/kebab", "value/font-family"];

export default {
  source: ["tokens/**/*.json"],
  usesDtcg: true,
  platforms: {
    scss: {
      transforms,
      prefix: "usa",
      buildPath: "build/scss/",
      files: [{ destination: "_tokens.scss", format: "scss/variables" }],
    },
    css: {
      transforms,
      prefix: "usa",
      buildPath: "build/css/",
      files: [{ destination: "tokens.css", format: "css/variables" }],
    },
  },
};
