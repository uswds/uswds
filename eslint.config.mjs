import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import-x";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import { configs as litConfigs } from "eslint-plugin-lit";
import globals from "globals";

const baseConfig = {
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      ...globals.node,
      ...globals.es2021,
      ...globals.mocha,
      // Browser globals — intentionally limited subset.
      window: "readonly",
      document: "readonly",
      navigator: "readonly",
      setTimeout: "readonly",
      clearTimeout: "readonly",
      setInterval: "readonly",
      clearInterval: "readonly",
      FileReader: "readonly",
      FileList: "readonly",
      getComputedStyle: "readonly",
      customElements: "readonly",
      KeyboardEvent: "readonly",
      MouseEvent: "readonly",
      HTMLElement: "readonly",
      Node: "readonly",
    },
  },
};

const pluginsConfig = {
  plugins: {
    // Registered as "import" to preserve backward compat with existing
    // eslint-disable comments referencing import/* rules.
    import: importPlugin,
    "no-unsanitized": noUnsanitized,
  },
  rules: {
    // --- Preventing bugs ---
    "no-param-reassign": ["error", { props: false }],
    "no-shadow": "error",
    "no-use-before-define": [
      "error",
      { functions: false, classes: true, variables: true },
    ],
    eqeqeq: ["error", "always", { null: "ignore" }],
    "no-return-assign": ["error", "always"],
    "no-loop-func": "error",
    "no-self-compare": "error",
    "no-unmodified-loop-condition": "error",
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true },
    ],
    // --- Security ---
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-extend-native": "error",
    "no-new-wrappers": "error",
    // --- Code style ---
    "no-var": "error",
    "prefer-const": [
      "error",
      { destructuring: "all", ignoreReadBeforeAssign: true },
    ],
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    curly: ["error", "multi-line"],
    "no-underscore-dangle": "warn",
    // --- Import rules ---
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "import/no-unresolved": ["error", { ignore: ["\\.(s?)css\\?inline$"] }],
    // --- Security (plugin) ---
    "no-unsanitized/method": "error",
    "no-unsanitized/property": "error",
  },
};

const testConfig = {
  files: ["**/*.spec.js", "**/*.spec.mjs", "**/*.spec.cjs"],
  rules: {
    "no-unsanitized/method": "off",
    "no-unsanitized/property": "off",
  },
};

// ESM source block — browser-facing component source in packages/.
// Excludes packages/usa-icon/src/usa-icons.config.js (Node-side build config).
const esmSourceConfig = {
  files: ["packages/**/*.js", "packages/**/*.mjs"],
  ignores: ["packages/usa-icon/src/usa-icons.config.js"],
  rules: {
    "import/named": "error",
    "import/no-cycle": "error",
    // Warn on extensionless specifiers as a migration progress signal.
    // Flipped to "error" in final cleanup (#6869).
    "import/extensions": [
      "warn",
      "ignorePackages",
      { js: "always", mjs: "always" },
    ],
  },
};

// Node-tooling block — files meant to stay CommonJS permanently.
// .storybook/preview.js uses ESM and is intentionally excluded.
const nodeToolingConfig = {
  files: [
    "gulpfile.js",
    "tasks/**/*.js",
    ".storybook/main.js",
    ".storybook/test-runner.js",
    "svgo.config.js",
    "webpack.twig.config.js",
    "packages/usa-icon/src/usa-icons.config.js",
  ],
  languageOptions: {
    sourceType: "commonjs",
    globals: {
      ...globals.node,
    },
  },
  rules: {
    "import/no-commonjs": "off",
    "import/named": "off",
    "import/no-cycle": "off",
    "import/extensions": "off",
  },
};

export default [
  {
    ignores: [
      "dist/",
      "_site/",
      "node_modules/",
      "packages/*/dist/",
      "**/*.min.js",
      ".agents/",
    ],
  },
  litConfigs["flat/recommended"],
  eslint.configs.recommended,
  baseConfig,
  pluginsConfig,
  testConfig,
  esmSourceConfig,
  nodeToolingConfig,
  prettier, // Must be last to disable formatting rules
];
