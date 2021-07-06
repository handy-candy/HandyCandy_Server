module.exports = {
  env: {
    node: true,
  },
  extends: ['airbnb-base', 'some-other-config-you-use', 'prettier'],
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
    // eslint-disable-next-line quote-props
    'camelcase': ['off'],
    'no-underscore-dangle': 'off',
    'operator-linebreak': 'off',
    'spaced-comment': [2, 'always', { exceptions: ['-', '+'] }],
    'no-return-assign': 'off',
    'no-use-before-define': 'off',
    'no-unused-expressions': 'off',
    'no-param-reassign': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-void': 'off',
    // eslint-disable-next-line quote-props
    'indent': 'off',
  },
};
