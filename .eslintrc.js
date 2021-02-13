module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ["plugin:import/errors", "plugin:import/warnings", "plugin:vue/recommended", "eslint:recommended", "plugin:prettier-vue/recommended", "prettier/vue"],
  globals: {
    __static: true,
  },
  plugins: [
    // 'html'
  ],
  rules: {
    // allow paren-less arrow functions
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "prettier-vue/prettier": ["warn"],
  },

  overrides: [
    {
      files: ["*.ts", "**/*.ts", "**/*.vue"],
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        sourceType: "module",
        ecmaVersion: 2020,
      },
      extends: [
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/recommended",
        "plugin:prettier-vue/recommended",
        "prettier/vue",
      ],
      rules: {
        "import/extensions": "off",
        "prettier-vue/prettier": ["warn"],
      },
      env: {
        browser: true,
        node: true,
      },
    },
  ],
};
