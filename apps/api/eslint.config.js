import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Add Node.js globals
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module", // Use module syntax for imports
      },
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
    },
  },
];
