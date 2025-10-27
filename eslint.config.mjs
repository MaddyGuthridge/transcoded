// @ts-check
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import stylistic from '@stylistic/eslint-plugin';
import esNode from 'eslint-plugin-n';
import globals from 'globals';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  ...ts.configs.stylisticTypeChecked,
  ...svelte.configs['flat/recommended'],
  stylistic.configs.recommended,
  {
    plugins: {
      n: esNode,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Seemingly not defined in `globals.browser`
        ScrollBehavior: 'readonly',
      }
    }
  },
  {
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        // ...
        project: true,
        extraFileExtensions: ['.svelte'], // This is a required setting in `@typescript-eslint/parser` v4.24.0.
      },
    },
  },
  {
    files: ['**/*.svelte', '*.svelte'],
    languageOptions: {
      parser: svelteParser,
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    rules: {
      // Default ESLint rules
      // ====================

      // Don't allow duplicate imports, because they are yucky
      'no-duplicate-imports': 'error',
      // Common mistake with `new Promise`
      'no-promise-executor-return': ['error', { allowVoid: true }],
      // Accidentally forgetting to use `back-ticks` for template literals
      'no-template-curly-in-string': 'error',
      // Use === instead of ==
      'eqeqeq': 'error',
      // Use dot notation for object property access
      'dot-notation': 'error',
      // Don't use `alert` and similar functions
      'no-alert': 'error',
      // Use camelCase for naming
      'camelcase': 'error',
      // Use `const` over `let` where reasonable
      // Not required for destructuring, since that just makes things painful for Svelte props where
      // some props are bindable
      'prefer-const': ['error', { destructuring: 'all' }],

      'no-restricted-imports': ['error', {
        patterns: [
          // Don't use legacy svelte features
          { group: ['svelte/legacy'], message: 'Avoid legacy Svelte features' },
          // Prevent importing from test files -- it causes tests to be registered multiple times,
          // making pipelines slow
          {
            regex: '.*\\.test(.(t|j)s)?$',
            message: (
              'Do not import from test files. This causes tests to be run repeatedly. Instead, '
              + 'move shared functionality to a separate non-test file.'),
          },
        ]
      }],

      // @typescript-eslint rules
      // ========================

      // Allow explicit any, to avoid type gymnastics
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        caughtErrors: 'none',
      }],
      // Disallow floating promises to avoid random crashes
      '@typescript-eslint/no-floating-promises': 'error',
      // Allow some `any` expressions since otherwise they seriously mess with tests, or enforce
      // strictness in areas where it really doesn't matter (eg error handling)
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      // Also disable template expression checks, since they're also error handling stuff
      // TODO: Enable them at some point when I get around to actually tidying things up
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      // FIXME: When I get around to hardening the request body validation, enable this rule again
      '@typescript-eslint/no-unsafe-member-access': 'off',
      // Allow empty functions, as they are useful to silence promise errors
      '@typescript-eslint/no-empty-function': 'off',
      // Use `type` instead of `interface`
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      // This error is already picked up by TypeScript, and it's annoying to need to silence it
      // twice when it is incorrect
      '@typescript-eslint/no-unsafe-call': 'off',

      // Stylistic ESLint rules
      // ======================

      // Use semicolons to help prevent weird and wonderful JS quirks
      '@stylistic/semi': ['error', 'always', { omitLastInOneLineBlock: true }],
      // Single quotes where possible
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: 'never' }],
      // Only quote object properties if it'd be a syntax error otherwise
      '@stylistic/quote-props': ['error', 'as-needed'],
      // Use one true brace style
      '@stylistic/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      // Always use comma for delimiting type definitions, since it matches object notation
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'comma',
          requireLast: true,
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false,
        }
      }],

      // Node (eslint-plugin-n) rules
      // ============================

      // For bin scripts listed in package.json, require a correct shebang
      'n/hashbang': 'error',
      // Don't concat to __file and __dirname (this is unsafe, use `path.join` instead)
      'n/no-path-concat': 'error',
      // Use `node:` prefix when importing from node standard library modules (they don't exist in
      // some other runtimes)
      'n/prefer-node-protocol': 'error',
    },
  },
  {
    ignores: [
      '**/.DS_Store',
      '**/node_modules',
      'build',
      '.svelte-kit',
      'package',
      '**/.env',
      '**/.env.*',
      '!**/.env.example',
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/svelte.config.js',
      '**/vitest.config.ts',
      'eslint.config.mjs',
      'vite.config.ts',
    ],
  },
);
