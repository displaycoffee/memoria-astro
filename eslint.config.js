// @ts-nocheck
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import astro from 'eslint-plugin-astro';

export default tseslint.config(
	{
		ignores: ['*.js', '*.mjs'],
	},
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2022,
			},
			parserOptions: {
				ecmaFeatures: { jsx: true },
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: {
			react: { version: 'detect' },
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts', '.tsx'],
			},
			'import/resolver': {
				typescript: { alwaysTryTypes: true },
			},
		},
	},
	js.configs.recommended,
	tseslint.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		extends: tseslint.configs.recommendedTypeChecked,
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	react.configs.flat.recommended,
	reactHooks.configs.flat.recommended,
	jsxA11y.flatConfigs.recommended,
	importPlugin.flatConfigs.errors,
	...astro.configs['flat/recommended'],
	eslintConfigPrettier,
	{
		rules: {
			'no-undef': 'off',
			'prefer-const': 'error',
			'@typescript-eslint/no-base-to-string': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-misused-promises': 'off',
			'@typescript-eslint/no-redundant-type-constituents': 'off',
			'@typescript-eslint/no-require-await': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/restrict-template-expressions': 'off',
			'import/no-unresolved': 'off',
			'react/no-unescaped-entities': 'off',
			'react/no-unknown-property': ['error', { ignore: ['set:html', 'set:text', 'is:raw', 'is:global', 'is:inline', 'class:list', 'define:vars'] }],
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
			'react-hooks/exhaustive-deps': 'error',
		},
	},
	{
		files: ['**/*.astro'],
		rules: {
			'react/no-unknown-property': 'off',
		},
	},
);
