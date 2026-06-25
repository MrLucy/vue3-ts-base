import pluginJs from '@eslint/js';
import importXPlugin from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier';
import vuePlugin from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...vuePlugin.configs['flat/essential'],
  importXPlugin.flatConfigs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off',

      // Import sorting rules
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: 'vue',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['vue'],
        },
      ],
      'import-x/no-duplicates': 'error',
      'import-x/no-unresolved': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-cycle': 'error',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
    },
  },
  // 忽略 commitlint 配置文件
  {
    ignores: ['commitlint.config.cjs'],
  },
];
