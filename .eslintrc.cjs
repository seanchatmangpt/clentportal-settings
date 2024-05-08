module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'eslint:recommended',
    '@vue/prettier',
    '@vue/typescript/recommended',
    'plugin:vue/vue3-essential',
    'plugin:markdown/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'vue/multi-word-component-names': 'warn',
    'no-useless-escapes': 'off', // TODO: change to error
    '@typescript-eslint/no-unused-vars': 'error',
    'vue/require-valid-default-prop': 'error',
    'vue/return-in-computed-property': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': [
      'error',
      { allow: ['clear', 'info', 'error', 'dir', 'trace', 'log'] },
    ],
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'script[setup]', 'template', 'style'],
      },
    ],
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowDestructuring: false,
        allowedNames: ['payoutList'],
      },
    ],
    'prettier/prettier': [
      'error',
      {
        semi: false,
        trailingComma: 'es5',
        singleQuote: true,
        arrowParens: 'avoid',
        tabWidth: 2,
        useTabs: false,
      },
    ],
  },
}
