import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'public/sw.js'],
  },
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      // App Router owns the root document; the pages/_document guidance is not applicable.
      '@next/next/no-page-custom-font': 'off',
      'react/no-unescaped-entities': 'off',
      // Existing data-loading effects are intentional; migrate them incrementally
      // before enabling React Compiler-specific effect diagnostics repository-wide.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
    },
  },
];

export default eslintConfig;
