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

**Source of truth:** See the "Deterministic Extraction Setup Guide" table in `README.md`.

### Convention boundary rule

**ONLY `orders-domain` may import from `@living-architecture/riviere-extract-conventions`.** This is enforced by dependency-cruiser. No other domain may depend on the conventions package — each domain uses its own independent detection strategy.

### ESLint convention rules (orders-domain only)

The ESLint convention rules (`api-controller-requires-route-and-method`, `event-requires-type-property`, `event-handler-requires-subscribed-events`) ONLY work on classes with `implements <ConventionInterface>`. Since only `orders-domain` uses convention interfaces from `@living-architecture/riviere-extract-conventions`, these rules are scoped exclusively to `orders-domain/src/**` in `eslint.config.mjs`. They have no effect on other domains and MUST NOT be applied to other domains.

### Per-domain summary

| Domain | Detection Strategy | Enforcement | FORBIDDEN |
|--------|-------------------|-------------|-----------|
| orders | Riviere default decorators (`@UseCase`, `@EventHandler`, etc.) + `extends` convention | ESLint convention rules (built-in) | N/A — this is the reference implementation |
| shipping | JSDoc tags (`@riviere useCase`, `@riviere eventHandler`, etc.) | Architectural unit tests | Importing `@living-architecture/riviere-extract-conventions` |
| inventory | Custom decorators (`@StockUseCase`, `@StockHandler`, `@StockOp`, etc.) | Architectural unit tests | Importing `@living-architecture/riviere-extract-conventions` |
| payments | Domain interfaces (`implements IPaymentUseCase`, `implements IEventHandler`, etc.) | Architectural unit tests | Importing `@living-architecture/riviere-extract-conventions` |
| notifications | Base classes (`extends BaseNotificationUseCase`, `extends BaseHandler`, etc.) | Architectural unit tests | Importing `@living-architecture/riviere-extract-conventions` |
| bff | Mixed (nameEndsWith + JSDoc) | Architectural unit tests | Importing `@living-architecture/riviere-extract-conventions` |
| ui | Name-based (`*Page` suffix) | Architectural unit tests | Importing `@living-architecture/riviere-extract-conventions` |

## Verifying Extraction

```bash
pnpm extract                    # Run extraction
cat extraction-output.json      # Check output
pnpm verify:extract             # Run verification tests
pnpm verify:connections         # Verify connection detection
```

The extraction output should list components from all 7 domains. If a domain shows 0 components, the config or source annotations are wrong.

### Ground Truth Files: Specification, Not Mirror

**Critical principle:** Ground truth files (`expected-extraction-output.json`, `expected-connections.json`) define **what the tool SHOULD extract**, verified through manual code inspection. They are **NOT records of what the tool currently does**.

**Purpose of ground truth:**
- Define the complete architectural reality (all components and connections that exist in code)
- Verify the extraction tool correctly detects everything
- **If verification fails** → tool has bugs/gaps that must be fixed in the living-architecture packages
- **If ground truth matches tool output exactly** → either:
  - ✅ Tool is working perfectly, OR
  - ❌ Ground truth was corrupted to match broken tool output (never do this)

**Why ground truth is essential:**
- Without ground truth: tool output is unvalidated—you don't know if it's correct
- With ground truth: tool output is validated—verification failures = product bugs requiring fixes

**Example:**
- Ground truth lists 77 connections (verified from code)
- Tool extracts 61 connections
- Verification FAILS ✓ This is correct! It reveals tool gaps in:
  - API→UseCase call detection
  - EventHandler→UseCase call detection
  - UseCase→DomainOp call detection
  - These gaps are product bugs in riviere-extract-ts that must be fixed

**Verification failure = valuable product feedback, not a test problem.**

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

## Pre-Push Compliance Check

**Before pushing any changes, run `/check-compliance` to verify all domains still follow their documented extraction strategies.** This catches accidental strategy drift (e.g. adding custom config rules to orders-domain, importing conventions package in non-orders domains, mixing detection strategies, etc.). Do not push if there are violations — fix them first.
