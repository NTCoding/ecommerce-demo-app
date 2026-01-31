# Rivière Living Architecture E-Commerce Demo Application

This is a demo application used as part of the [Living Architecture](https://living-architecture.dev) project.

The `.riviere` folder contains an example of the [extraction workflow](https://living-architecture.dev/extract/steps/) — a 6-step process for extracting architecture from codebases into a Rivière graph.

See the [live demo](https://living-architecture.dev/eclair/?demo=true) to explore the extracted architecture.

---

## How to Run This Demo App

### Prerequisites

- Node.js 20+

### Install & Verify

```bash
npm run install:all    # Install all dependencies
npm run build          # Build all domains
npm run lint:arch      # Run architectural enforcement (orders-domain ESLint)
npm run lint:deps      # Run dependency boundary enforcement (dependency-cruiser)
npm run test:arch      # Run architectural tests (all domains)
npm run verify:extract # Verify extraction produces expected components
```

### Extract Architecture

```bash
npm run extract:save   # Extract architecture graph → .riviere/architecture.json
```

This runs the Rivière extractor across all 7 domains and writes the full architecture graph to `.riviere/architecture.json`. The output contains all 68 detected components with their metadata, ready for viewing in [Eclair](https://living-architecture.dev/eclair/?demo=true).

---

## Deterministic Extraction Setup Guide

This guide shows how to set up deterministic component extraction with enforcement. Each domain in this app uses a different extraction strategy to demonstrate the flexibility of the system.

| Domain | Convention | Enforcement |
|--------|------------|-------------|
| orders | Riviere default: `@UseCase`, `@EventHandler`, `@DomainOp`, `@Api`, `@Event` | ESLint rule (built-in) |
| shipping | JSDoc: `@riviere useCase`, `@riviere eventHandler`, etc. | Architectural unit tests |
| inventory | Custom decorators: `@StockUseCase`, `@StockHandler`, `@StockOp` | Architectural unit tests |
| payments | Interface-based: `implements IUseCase`, `implements IEventHandler` | Architectural unit tests |
| notifications | Base class: `extends BaseNotificationUseCase`, `extends BaseHandler` | Architectural unit tests |
| bff | Crazy mix: different strategy per component type | Architectural unit tests |
| ui | Name-based: `*Page` suffix | Architectural unit tests |

**Key insight:** The `@living-architecture/riviere-extract-conventions` package includes an ESLint rule that enforces decorator usage. For other strategies (JSDoc, custom decorators, naming conventions), you need alternative enforcement like architectural unit tests or custom lint rules.

---

## Orders Domain: Decorator-Based Enforcement

This domain uses the built-in ESLint enforcement from the conventions package.

### Step 1: Install the Conventions Package

```bash
cd orders-domain
npm install @living-architecture/riviere-extract-conventions eslint @typescript-eslint/parser
```

### Step 2: Set Up ESLint Enforcement

Create `eslint.config.mjs`:

```javascript
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
```

**Note:** Domain entities and infrastructure code are excluded via `ignores`. Only application-layer classes (use cases, handlers, etc.) require component decorators.

### Step 3: Run Lint — Watch It FAIL

```bash
npx eslint src/
```

**Output (7 errors):**
```
src/api/cancel-order/use-cases/cancel-order-use-case.ts
  9:14  error  Class 'CancelOrderUseCase' requires a component decorator. Add one of: @UseCase, @Event, @UI, @DomainOpContainer, @APIContainer, @EventHandlerContainer, @Custom('type'), or @Ignore

src/api/place-order/use-cases/place-order-use-case.ts
  10:14  error  Class 'PlaceOrderUseCase' requires a component decorator...

src/consumer/inventory-reserved/use-cases/confirm-order-after-inventory-use-case.ts
  3:14  error  Class 'ConfirmOrderAfterInventoryUseCase' requires a component decorator...

src/consumer/payment-completed/use-cases/confirm-order-after-payment-use-case.ts
  4:14  error  Class 'ConfirmOrderAfterPaymentUseCase' requires a component decorator...

src/consumer/payment-failed/use-cases/cancel-order-after-payment-failure-use-case.ts
  4:14  error  Class 'CancelOrderAfterPaymentFailureUseCase' requires a component decorator...

src/consumer/shipment-delivered/use-cases/complete-order-use-case.ts
  3:14  error  Class 'CompleteOrderUseCase' requires a component decorator...

src/consumer/shipment-dispatched/use-cases/ship-order-use-case.ts
  3:14  error  Class 'ShipOrderUseCase' requires a component decorator...

✖ 7 problems (7 errors, 0 warnings)
```

The enforcement is working! Every use case class without a decorator is flagged.

### Step 4: Add Decorators to Fix Lint Errors

For use case classes, add `@UseCase`:

```typescript
import { UseCase } from '@living-architecture/riviere-extract-conventions'

@UseCase
export class PlaceOrderUseCase {
  apply(request: PlaceOrderRequest): Order {
    // ...
  }
}
```

### Step 5: Run Lint Again — Watch It PASS

```bash
npx eslint src/
```

**Output:**
```
(no output - all 7 use cases now have decorators)
```

✅ **Enforcement complete!** The ESLint rule ensures no class can be added without a component decorator.

---

## Other Domains: Architectural Unit Test Enforcement

For domains NOT using the conventions package decorators, you can enforce component annotation coverage using architectural unit tests.

### Example: Shipping Domain (JSDoc Strategy)

**shipping-domain/src/__tests__/architecture.test.ts:**
```typescript
import { describe, it, expect } from 'vitest'
import { Project } from 'ts-morph'
import { globSync } from 'glob'

describe('shipping-domain', () => {
  describe('Use Cases must have @riviere UseCase JSDoc tag', () => {
    // Known components - ensures they exist and are properly annotated
    it('DispatchShipmentUseCase', () => {
      // Verify specific component has the tag
    })

    // Catch-all - fails if ANY new use case is added without annotation
    it('no unannotated use cases', () => {
      const useCaseFiles = globSync('**/use-cases/**/*.ts', { cwd: srcDir, absolute: true })
      const violations: string[] = []

      for (const filePath of useCaseFiles) {
        // Parse with ts-morph, check for @riviere UseCase tag
        // tag.getTagName() === 'riviere' && tag.getCommentText() === 'UseCase'
      }

      expect(violations).toEqual([])
    })
  })
})
```

This approach:
1. **Verifies known components** - Individual tests ensure each expected use case exists and is annotated
2. **Catches violations** - The catch-all test fails if any new use case is added without the required annotation

See `shipping-domain/src/__tests__/architecture.test.ts` for the full implementation.

---

## Shipping Domain: JSDoc-Based Annotation

This domain uses JSDoc tags instead of decorators.

### Annotations Applied

```typescript
/** @riviere UseCase */
export class DispatchShipmentUseCase {
  // ...
}

/** @riviere EventHandler */
export function handleOrderConfirmed(event: OrderConfirmed): void {
  // ...
}

/** @riviere API */
export function dispatchShipmentEndpoint(useCase: DispatchShipmentUseCase) {
  // ...
}
```

---

## Inventory Domain: Custom Decorator Mapping

This domain uses locally-defined decorators that are mapped in the extraction config.

### Step 1: Create Custom Decorators

**inventory-domain/src/decorators.ts:**
```typescript
type Constructor = new (...args: unknown[]) => object

export function StockUseCase<T extends Constructor>(target: T, _: ClassDecoratorContext): T {
  return target
}
```

### Step 2: Apply to Classes

```typescript
import { StockUseCase } from '../decorators'

@StockUseCase
export class CheckStockUseCase {
  // ...
}
```

### Step 3: Map in Extraction Config

The extraction config maps the custom decorator:
```json
{
  "name": "inventory",
  "path": "inventory-domain/src/**/*.ts",
  "useCase": {
    "find": "classes",
    "where": { "hasDecorator": { "name": "StockUseCase" } }
  }
}
```

---

## Payments Domain: Naming Convention

This domain uses no decorators or annotations. Instead, the extraction config matches by naming pattern.

### Existing Code (No Changes Needed)

```typescript
// Already follows naming convention
export class ProcessPaymentUseCase { ... }
export class RefundPaymentUseCase { ... }
```

### Extraction Config

```json
{
  "name": "payments",
  "path": "payment-domain/src/**/*.ts",
  "useCase": {
    "find": "classes",
    "where": { "nameEndsWith": { "suffix": "UseCase" } }
  }
}
```

---

## Extraction Config

The complete extraction config (`extraction.config.json`) at the project root:

```json
{
  "$schema": "https://living-architecture.dev/schemas/extraction-config.schema.json",
  "modules": [
    {
      "name": "orders",
      "path": "orders-domain/src/**/*.ts",
      "useCase": {
        "find": "classes",
        "where": {
          "hasDecorator": {
            "name": "UseCase",
            "from": "@living-architecture/riviere-extract-conventions"
          }
        }
      }
    },
    {
      "name": "shipping",
      "path": "shipping-domain/src/**/*.ts",
      "useCase": {
        "find": "classes",
        "where": { "hasJSDoc": { "tag": "riviere" } }
      }
    },
    {
      "name": "inventory",
      "path": "inventory-domain/src/**/*.ts",
      "useCase": {
        "find": "classes",
        "where": { "hasDecorator": { "name": "StockUseCase" } }
      }
    },
    {
      "name": "payments",
      "path": "payment-domain/src/**/*.ts",
      "useCase": {
        "find": "classes",
        "where": { "nameEndsWith": { "suffix": "UseCase" } }
      }
    }
  ]
}
```

Each module demonstrates a different extraction strategy:
- **orders**: Package decorators with source tracking (`from`)
- **shipping**: JSDoc tags
- **inventory**: Custom local decorators
- **payments**: Naming convention (no code changes needed)

## Running Extraction

```bash
riviere extract --config extraction.config.json
```

**Expected output (12 use cases total):**
```json
{
  "components": [
    { "type": "useCase", "name": "PlaceOrderUseCase", "domain": "orders" },
    { "type": "useCase", "name": "CancelOrderUseCase", "domain": "orders" },
    { "type": "useCase", "name": "ConfirmOrderAfterInventoryUseCase", "domain": "orders" },
    { "type": "useCase", "name": "ConfirmOrderAfterPaymentUseCase", "domain": "orders" },
    { "type": "useCase", "name": "CancelOrderAfterPaymentFailureUseCase", "domain": "orders" },
    { "type": "useCase", "name": "CompleteOrderUseCase", "domain": "orders" },
    { "type": "useCase", "name": "ShipOrderUseCase", "domain": "orders" },
    { "type": "useCase", "name": "DispatchShipmentUseCase", "domain": "shipping" },
    { "type": "useCase", "name": "CreateShipmentUseCase", "domain": "shipping" },
    { "type": "useCase", "name": "UpdateTrackingUseCase", "domain": "shipping" },
    { "type": "useCase", "name": "CheckStockUseCase", "domain": "inventory" },
    { "type": "useCase", "name": "ReserveInventoryUseCase", "domain": "inventory" },
    { "type": "useCase", "name": "ReleaseInventoryUseCase", "domain": "inventory" },
    { "type": "useCase", "name": "AllocateInventoryUseCase", "domain": "inventory" },
    { "type": "useCase", "name": "ProcessPaymentUseCase", "domain": "payments" },
    { "type": "useCase", "name": "RefundPaymentUseCase", "domain": "payments" }
  ]
}
```

## Summary

This demo shows 4 different extraction strategies working together:

| Domain | Strategy | Enforcement | Extraction |
|--------|----------|-------------|------------|
| orders | `@UseCase` decorator | ESLint rule | `hasDecorator` with `from` |
| shipping | `@riviere UseCase` JSDoc | Arch tests | `hasJSDoc` |
| inventory | `@StockUseCase` custom | Arch tests | `hasDecorator` |
| payments | `*UseCase` naming | Arch tests | `nameEndsWith` |

The key insight: **enforcement ensures consistency, extraction reads the annotations**. Together they provide deterministic, maintainable architecture documentation.

---

## Running Locally

### Quick Check

```bash
npm run lint:arch
```

This runs architectural enforcement across all domains.

### Pre-commit Hook

Architectural violations are blocked at commit time via husky:

```bash
# Setup (already configured)
npm install
npx husky install
```

The pre-commit hook runs `npm run lint:arch` and `npm run lint:deps` automatically.

### CI Enforcement

GitHub Actions runs the same checks on every push and PR. See `.github/workflows/architecture.yml`.
