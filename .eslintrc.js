module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    es6: true,
    node: true
  },
  rules: {
    quotes: ['error', 'single'],
    'no-var': 'error',
    semi: ['error', 'always'],
    indent: ['error', 2],
    'no-multi-spaces': 'error',
    'space-in-parens': 'error',
    'no-multi-spaces': ['error'],
    'no-multiple-empty-lines': 'error',
    'prefer-const': 'error'
  }
};
