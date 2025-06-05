import eslint from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import path from "path";
import { fileURLToPath } from "url";
import { configs as litConfigs } from "eslint-plugin-lit";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const airbnbConfig = compat.config({
  extends: ["airbnb-base"],
});

const customConfig = {
  plugins: {
    import: importPlugin,
    "no-unsanitized": noUnsanitized,
  },
  rules: {
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-unsanitized/method": "error",
    "no-unsanitized/property": "error",
    "no-underscore-dangle": "warn", // Allow _ in variable names, but discourage it
    "import/no-unresolved": [2, { ignore: ["\\.(s?)css\\?inline$"] }],
  },
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    globals: {
      ...globals.node,
      ...globals.es6,
      ...globals.mocha,

      // Use globals from eslint where possible, but globals.browser breaks stuff for some reason
      window: true,
      document: true,
      navigator: true,
      console: true,
      module: true,
      setTimeout: true,
      clearTimeout: true,
      setInterval: true,
      clearInterval: true,
      FileReader: "readonly",
      getComputedStyle: true,
      customElements: true,
    },
  },
};

const testConfig = {
  files: ["**/*.spec.js"],
  rules: {
    "no-unsanitized/method": "off",
    "no-unsanitized/property": "off",
  },
};

export default [
  litConfigs["flat/recommended"],
  eslint.configs.recommended,
  ...airbnbConfig,
  customConfig,
  testConfig,
  prettier,
];
