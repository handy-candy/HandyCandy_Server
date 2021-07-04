module.exports = {
  env: {
    node: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'off',
    'no-unused-vars': 1,
    'import/no-unresolved': 'off',
    'import/extensions': ['off'],
    'object-curly-newline': 'off',
  },
};
