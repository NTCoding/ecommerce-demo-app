import conventionsPlugin from '@living-architecture/riviere-extract-conventions/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: [
      'orders-domain/src/**/api/**/endpoint.ts',
      'shipping-domain/src/**/api/**/endpoint.ts',
      'inventory-domain/src/**/api/**/endpoint.ts',
      'bff/src/**/api/**/endpoint.ts',
    ],
    languageOptions: { parser: tsParser },
    plugins: { conventions: conventionsPlugin },
    rules: {
      'conventions/api-controller-requires-route-and-method': 'error',
    },
  },
  {
    files: [
      'orders-domain/src/**/events.ts',
      'shipping-domain/src/**/events.ts',
      'inventory-domain/src/**/events.ts',
      'payment-domain/src/**/events.ts',
    ],
    languageOptions: { parser: tsParser },
    plugins: { conventions: conventionsPlugin },
    rules: {
      'conventions/event-requires-type-property': 'error',
    },
  },
  {
    files: [
      'orders-domain/src/**/consumer/**/handler.ts',
      'shipping-domain/src/**/consumer/**/handler.ts',
      'inventory-domain/src/**/consumer/**/handler.ts',
      'payment-domain/src/**/consumer/**/handler.ts',
      'notifications-domain/src/**/consumer/**/handler.ts',
    ],
    languageOptions: { parser: tsParser },
    plugins: { conventions: conventionsPlugin },
    rules: {
      'conventions/event-handler-requires-subscribed-events': 'error',
    },
  },
  {
    files: ['ui/src/**/pages/**/*.tsx'],
    languageOptions: { parser: tsParser },
    plugins: { conventions: conventionsPlugin },
    rules: {
      'conventions/ui-page-requires-route': 'error',
    },
  },
]
