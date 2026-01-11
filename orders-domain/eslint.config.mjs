import conventionsPlugin from '@living-architecture/riviere-extract-conventions/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['src/**/*.ts'],
    ignores: ['src/domain/**/*.ts', 'src/infrastructure/**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: { conventions: conventionsPlugin },
    rules: { 'conventions/require-component-decorator': 'error' },
  },
]
