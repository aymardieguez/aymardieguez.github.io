import js from '@eslint/js';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'docs/**', 'test-results/**'] },
  js.configs.recommended,
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
        Buffer: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
      },
    },
  },
  {
    files: ['assets/*.mjs', 'qa/*.mjs'],
    languageOptions: {
      globals: {
        document: 'readonly',
        innerWidth: 'readonly',
        window: 'readonly',
        FormData: 'readonly',
        matchMedia: 'readonly',
        IntersectionObserver: 'readonly',
      },
    },
  },
];
