'use strict'

const { overrides } = require('@netlify/eslint-config-node/.eslintrc_esm.cjs')

module.exports = {
  ignorePatterns: ['test/fixtures/', 'README.md'],
  extends: '@netlify/eslint-config-node/.eslintrc_esm.cjs',
  rules: {
    'n/no-missing-import': 'off',
    // This is disabled because TypeScript transpiles some features currently
    // unsupported by Node 12, i.e. optional chaining
    // TODO: re-enable after dropping support for Node 12
    'n/no-unsupported-features/es-syntax': 'off',
  },
  overrides: [
    ...overrides,
    {
      files: '*.ts',
      rules: {
        // Pure ES modules with TypeScript require using `.js` instead of `.ts`
        // in imports
        'import/extensions': 'off',
        'import/no-namespace': 'off',
      },
    },
  ],
}
