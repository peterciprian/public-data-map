import pluginJs from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const parser = tseslint.parser;

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		ignores: [
			'node_modules/**',
			'.next/**',
			'dist/**',
			'build/**',
			'coverage/**',
			'**/*.stories.{ts,tsx}',
			'setup.ts',
			'vite.config.ts',
			'.storybook/**'
		]
	},
	{
		languageOptions: {
			globals: globals.browser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: { jsx: true }
			}
		}
	},

	// JavaScript Configuration
	pluginJs.configs.recommended,

	// TypeScript Configuration
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser,
			parserOptions: {
				project: './tsconfig.json'
			}
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin
		},
		rules: {
			'prefer-const': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn'
		},
		settings: {
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts', '.tsx']
			},
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json'
				}
			}
		}
	},

	// NextJs Configuration
	{
		files: ['**/pages/**/*.{ts,tsx}', '**/app/**/*.{ts,tsx}'],
		plugins: {
			react: pluginReact,
			'@next/next': nextPlugin
		},
		rules: {
			'@next/next/no-html-link-for-pages': 'error',
			'@next/next/no-img-element': 'warn',
			...nextPlugin.configs.recommended.rules
		}
	},

	// React and JSX Configuration
	pluginReact.configs.flat.recommended,

	{
		settings: {
			react: { version: 'detect' }
		},
		files: ['**/*.{js,jsx,tsx}'],
		plugins: {
			react: pluginReact,
			'react-hooks': reactHooks
		},
		rules: {
			'no-undef': 'warn',
			'react/jsx-no-undef': 'error',
			'react/prop-types': 'warn',
			'react/jsx-uses-vars': 'error',
			// React Hooks
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			// React best practices
			'react/no-array-index-key': 'warn',
			'react/jsx-props-no-spreading': 'off',
			'react/jsx-boolean-value': 'warn',
			'react/jsx-curly-brace-presence': 'warn',
			'react/jsx-no-useless-fragment': 'warn',
			'react/react-in-jsx-scope': 'off'
		}
	},

	// Unused Imports and Variables
	{
		plugins: {
			'unused-imports': unusedImports
		},
		rules: {
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_' // use this  only for interfaces!
				}
			],
			'unused-imports/no-unused-imports': 'warn'
		}
	},

	// Import Rules
	{
		files: ['**/*.{js,mjs,cjs,mjs,jsx,ts,tsx}'],
		plugins: {
			import: importPlugin
		},

		rules: {
			'no-restricted-imports': [
				'warn',
				{
					paths: [
						{
							name: '@mui/material',
							message: `Named imports are slow, use default exports, eg:
										"import Something from '@mui/material/Something"
								 		instead. If you import "type", then add
										"eslint-disable-next-line no-restricted-imports"`
						}
					]
				}
			],
			'import/no-dynamic-require': 'warn',
			'import/no-nodejs-modules': 'warn',
			'import/order': [
				'warn',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index'
					],

					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true }
				}
			]
		}
	},

	// Jest Test Files
	{
		files: [
			'**/*.{test,spec}.{js,ts,jsx,tsx}',
			'**/__tests__/**/*.{js,ts,jsx,tsx}'
		],

		languageOptions: {
			globals: {
				...globals.jest
			}
		},
		rules: {
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn'
		}
	},

	// Common Rules (All Files)
	{
		rules: {
			'eol-last': ['error', 'always'],
			'max-len': [
				'warn',
				{
					code: 180,
					comments: 180,
					ignorePattern: '^import .*',
					ignoreUrls: true,
					ignoreTemplateLiterals: true
				}
			]
		}
	}
];

