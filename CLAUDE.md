# ecommerce-demo-app

## Primary Purpose

This is a dogfooding demo app. It demonstrates how a real user would use the living-architecture npm packages.

**Everything subordinates to this purpose.**

- Always depend on published npm packages, never local versions
- If a package has bugs, create an issue and wait for a fix - do not hack around it
- This repo validates that the packages work correctly for end users

## Dependencies

This project depends on these npm packages (not local versions):

- `@living-architecture/riviere-cli` - Extraction CLI
- `@living-architecture/riviere-extract-conventions` - Default decorators

## Commands

```bash
pnpm build          # Build all domains
pnpm lint:arch      # Lint (orders domain - ESLint architectural rules)
pnpm test:arch      # Test architectural enforcement
pnpm extract        # Run extraction
pnpm verify:extract # Verify extraction output
```

## Domains & Extraction Strategies

| Domain | Strategy | Config |
|--------|----------|--------|
| orders | Riviere default decorators | `extends` convention package |
| shipping | JSDoc tags | `@useCase`, `@eventHandler`, `@domainOp`, `@api`, `@event` |
| inventory | Custom decorators | `@StockUseCase`, `@StockHandler`, `@StockOp`, `@StockAPI`, `@StockEvent` |
| payment | Interface-based | `implements IPaymentUseCase`, etc. |
| notifications | Base class | `extends BaseNotificationUseCase`, etc. |
| bff | Crazy mix | nameEndsWith + JSDoc |
| ui | Name-based | `*Page` suffix |

## Verifying Extraction

```bash
pnpm extract                    # Run extraction
cat extraction-output.json      # Check output
pnpm verify:extract             # Run verification tests
```

The extraction output should list components from all 7 domains. If a domain shows 0 components, the config or source annotations are wrong.

## File Structure

```
ecommerce-demo-app/
├── extraction.config.json      # Central extraction config
├── orders-domain/src/          # Riviere decorators
├── shipping-domain/src/        # JSDoc tags
├── inventory-domain/src/       # Custom decorators
├── payment-domain/src/         # Interface-based
├── notifications-domain/src/   # Base class
├── bff/src/                    # Mixed strategies
└── ui/src/                     # Name-based (*Page)
```

Each domain has:
- `src/api/` - API endpoints
- `src/consumer/` - Event handlers
- `src/domain/` - Domain operations and events
- `src/infrastructure/` - Supporting code

## Related Repos

- [living-architecture](https://github.com/NTCoding/living-architecture) - Source for npm packages
  - `packages/riviere-cli` - The extraction CLI
  - `packages/riviere-extract-conventions` - Default decorators

If you find bugs in the npm packages, create issues there - do not modify this repo to work around them.
