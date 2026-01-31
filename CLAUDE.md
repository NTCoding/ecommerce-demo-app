# ecommerce-demo-app

## 🚨 CRITICAL: This Repo Tests Our Product — Never Work Around Bugs

This repo exists to **test and demo the living-architecture npm packages**. It is the primary feedback loop for our product. Everything subordinates to this purpose.

**When something doesn't work, that is product feedback. The bug is in our packages, not in this repo.**

### Mandatory Protocol When You Hit a Bug

1. **STOP.** Do not modify this repo to suppress, avoid, or work around the error.
2. **Diagnose the root cause** in the living-architecture package (riviere-cli, riviere-extract-conventions, riviere-extract-ts, etc.).
3. **Fix the bug** in the living-architecture repo.
4. **Publish a new npm version** of the affected package.
5. **Update the dependency** in this repo (`pnpm update @living-architecture/<package>`).
6. **Verify the fix** by re-running the failing command in this repo.

### What Counts as a Workaround (FORBIDDEN)

- Overriding config to skip broken features instead of fixing the feature
- Removing `implements` clauses because the interface is badly designed
- Adding try/catch to suppress extraction errors
- Using alternative detection strategies because the intended one fails
- Any change to this repo whose purpose is to avoid triggering a bug in our packages

### Why This Matters

If you work around a bug here, the bug ships to real users. This repo IS the user. If it doesn't work here, it doesn't work anywhere. Every workaround hides a product defect and wastes time that should have been spent fixing the root cause.

## Dependencies

This project depends on these npm packages (not local versions):

- `@living-architecture/riviere-cli` - Extraction CLI
- `@living-architecture/riviere-extract-conventions` - Default decorators

## Commands

```bash
pnpm install:all    # Install all dependencies (root + all domains)
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

**If you find bugs in the npm packages, fix them there. Do not modify this repo to work around them. See the mandatory protocol at the top of this file.**
