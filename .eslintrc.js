module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    // Error prevention
    'no-console': 'off', // Allow console.log for this project
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',

    // Stylistic preferences
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],

    // Node.js specific
    'node/exports-style': ['error', 'module.exports'],
    'node/file-extension-in-import': ['error', 'never'],
    'node/prefer-global/buffer': ['error', 'always'],
    'node/prefer-global/console': ['error', 'always'],
    'node/prefer-global/process': ['error', 'always'],
    'node/no-unsupported-features/es-syntax': 'off', // Allow modern ES syntax

    // Best practices
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'prefer-const': 'warn',
    'no-var': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    'allure-report/',
    'allure-results/',
    'playwright-report/',
    'test-results/',
  ],
  overrides: [
    {
      files: ['playwright/**/*.js'],
      rules: {
        'node/no-unpublished-require': 'off', // Allow requiring devDependencies in test files
      },
    },
  ],
};
