const js = require('@eslint/js');
const nodePlugin = require('eslint-plugin-n');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // Ignore patterns - must be first
  {
    ignores: [
      'node_modules/',
      'allure-report/',
      'allure-results/',
      'playwright-report/',
      'test-results/',
      'public/js/bootstrap.bundle.min.js',
      'eslint.config.js',
      '.prettierrc.js',
    ],
  },

  // Base configuration for all files
  js.configs.recommended,
  prettierConfig,

  // Node.js server-side files
  {
    files: ['server/**/*.js', 'playwright.config.js'],
    ...nodePlugin.configs['flat/recommended'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      // Error prevention
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',

      // Stylistic preferences
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],

      // Node.js specific
      'n/exports-style': ['error', 'module.exports'],
      'n/file-extension-in-import': ['error', 'never'],
      'n/prefer-global/buffer': ['error', 'always'],
      'n/prefer-global/console': ['error', 'always'],
      'n/prefer-global/process': ['error', 'always'],
      'n/no-unsupported-features/es-syntax': 'off',

      // Best practices
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },

  // Browser-side files
  {
    files: ['public/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      // Error prevention
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',

      // Stylistic preferences
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],

      // Best practices
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },

  // Playwright test files
  {
    files: ['playwright/**/*.js'],
    ...nodePlugin.configs['flat/recommended'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'n/no-unpublished-require': 'off',
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
    },
  },
];
