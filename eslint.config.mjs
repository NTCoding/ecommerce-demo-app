import conventionsPlugin from '@living-architecture/riviere-extract-conventions/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['orders-domain/src/**/api/**/endpoint.ts'],
    languageOptions: { parser: tsParser },
    plugins: { conventions: conventionsPlugin },
    rules: {
      'conventions/api-controller-requires-route-and-method': 'error',
    },
  },
  {
    files: ['orders-domain/src/**/events.ts'],
    languageOptions: { parser: tsParser },
    plugins: { conventions: conventionsPlugin },
    rules: {
      'conventions/event-requires-type-property': 'error',
    },
  },
  {
    files: ['orders-domain/src/**/consumer/**/handler.ts'],
    languageOptions: { parser: tsParser },
    plugins: { conventions: conventionsPlugin },
    rules: {
      'conventions/event-handler-requires-subscribed-events': 'error',
    },
  },
]
