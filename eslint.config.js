import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'node_modules',
      '**/node_modules/**',
      'dist',
      '**/dist/**',
      'coverage',
      '**/coverage/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'writable',
      },
    },
  }
);
