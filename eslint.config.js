import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import {fileURLToPath} from 'url';

const project = fileURLToPath(new URL('tsconfig.json', import.meta.url));

export default tseslint.config(
    {
        ignores: [
            'bin/**',
            'config/**',
            'docker/**',
            'migrations/**',
            'node_modules/**',
            'public/**',
            'src/**',
            'templates/**',
            'var/**',
            'vendors/**',
        ],
    },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            import('@vercel/style-guide/eslint/browser'),
            import('@vercel/style-guide/eslint/react'),
            import('@vercel/style-guide/eslint/typescript'),
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                project,
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            react,
            'import': importPlugin
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'semi': 'error',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-confusing-void-expression': [
                'error',
                {ignoreArrowShorthand: true},
            ],
            '@typescript-eslint/no-shadow': 'off',
            '@typescript-eslint/no-misused-promises': [
                'error',
                {checksVoidReturn: {attributes: false}},
            ],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowAny: false,
                    allowBoolean: false,
                    allowNullish: false,
                    allowRegExp: false,
                    allowNever: false,
                },
            ],
            'react/function-component-definition': [
                'warn',
                {
                    namedComponents: 'arrow-function',
                    unnamedComponents: 'arrow-function',
                },
            ],
            'react/jsx-sort-props': [
                'warn',
                {
                    callbacksLast: true,
                    shorthandFirst: true,
                    multiline: 'last',
                    reservedFirst: true,
                },
            ],
            'react-refresh/only-export-components': [
                'warn',
                {allowConstantExport: true},
            ],
            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    'newlines-between': 'always',
                    alphabetize: {order: 'asc'},
                },
            ],
            // sort named imports within an import statement
            'sort-imports': ['warn', {ignoreDeclarationSort: true}],
        },
    },
);
