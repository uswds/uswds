import eslint from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import path from "path";
import { fileURLToPath } from "url";

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
  },
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    globals: {
      window: true,
      document: true,
      navigator: true,
      console: true,
      module: true,
      require: true,
      process: true,
      __dirname: true,
      __filename: true,
      Buffer: true,
      setTimeout: true,
      clearTimeout: true,
      setInterval: true,
      clearInterval: true,
      FileReader: "readonly",
      getComputedStyle: true,

      // Test-specific globals
      describe: true,
      it: true,
      before: true,
      after: true,
      beforeEach: true,
      afterEach: true,
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
  eslint.configs.recommended,
  ...airbnbConfig,
  customConfig,
  testConfig,
  prettier,
];
