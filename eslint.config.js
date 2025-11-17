const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // Ignore patterns - must be first
  {
    ignores: [
      'node_modules/',
      'dist/',
      'allure-report/',
      'allure-results/',
      'playwright-report/',
      'test-results/',
      'eslint.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      '**/*.d.ts',
    ],
  },

  // Base configuration for all files
  js.configs.recommended,
  prettierConfig,

  // TypeScript files (server and client)
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Disable base rules that are handled by TypeScript
      'no-unused-vars': 'off',
      'no-undef': 'off',

      // Stylistic preferences
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],

      // Best practices
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-console': 'off',
    },
  },

  // TypeScript server files - additional Node.js rules
  {
    files: ['src/server/**/*.ts'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
      },
    },
  },

  // TypeScript client files - additional browser rules
  {
    files: ['src/client/**/*.ts', 'src/client/**/*.tsx'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
      },
    },
  },

  // Vite config file
  {
    files: ['vite.config.ts'],
    languageOptions: {
      parser: tsParser,
      globals: {
        __dirname: 'readonly',
      },
    },
  },
];
