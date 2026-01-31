# Check Extraction Strategy Compliance

You are a compliance auditor for the ecommerce-demo-app. Your job is to verify that each of the 7 domains strictly follows its documented extraction strategy. This is CRITICAL — this repo exists to demo and validate the living-architecture npm packages. Strategy drift means bugs ship to real users.

## Instructions

Launch **7 parallel sonnet subagents** using the Task tool (one per domain). Each agent audits its domain and returns a PASS/FAIL compliance report. After all complete, aggregate into a master report.

For each agent: set `subagent_type` to `general-purpose` and `model` to `sonnet`.

---

## Agent 1: Orders Domain (GOLDEN PATH)

```
You are auditing the ORDERS domain for extraction strategy compliance. This is the GOLDEN PATH — it must be pristine with minimal config and full use of the official conventions package.

Read these files and check every rule below. Flag ANYTHING suspicious.

FILES TO READ:
- .riviere/config/orders.extraction.json
- orders-domain/package.json
- eslint.config.mjs
- All .ts files under orders-domain/src/api/, orders-domain/src/consumer/, orders-domain/src/domain/, orders-domain/src/infrastructure/

CONFIG RULES (orders.extraction.json):
- MUST have "extends": "@living-architecture/riviere-extract-conventions"
- MUST have "name" and "path" keys
- MUST NOT have any custom detection rules (no "useCase", "eventHandler", "api", "event", "domainOp", "ui" keys with "find"/"where" blocks)
- The entire config should be ~3-4 keys total. If it has more, that's a violation.

SOURCE RULES:
- All use case classes MUST use @UseCase decorator from @living-architecture/riviere-extract-conventions
- All API endpoint classes MUST use @APIContainer decorator and implement APIControllerDef
- All event handler classes MUST use @EventHandlerContainer decorator and implement EventHandlerDef
- All event classes MUST use @Event decorator and implement EventDef
- All domain operation classes MUST use @DomainOpContainer decorator
- NO JSDoc tags for detection, NO naming conventions, NO custom decorators

ESLINT RULES (eslint.config.mjs):
- Must configure the conventions ESLint plugin for orders-domain/src/**
- Must include rules: api-controller-requires-route-and-method, event-requires-type-property, event-handler-requires-subscribed-events

PACKAGE.JSON:
- Must list @living-architecture/riviere-extract-conventions as a dependency

OUTPUT FORMAT:
# Orders Domain Compliance Report
## Config: [PASS/FAIL]
[details]
## Source: [PASS/FAIL]
[details - list every component file checked]
## ESLint: [PASS/FAIL]
[details]
## Violations
[list with file paths and line numbers, or "None"]
```

---

## Agent 2: Shipping Domain (JSDoc)

```
You are auditing the SHIPPING domain for extraction strategy compliance. This domain uses JSDoc tags for detection.

FILES TO READ:
- .riviere/config/shipping.extraction.json
- shipping-domain/package.json
- All .ts files under shipping-domain/src/

CONFIG RULES:
- MUST use "hasJSDoc" detection for component types (useCase, eventHandler, api, event, domainOp)
- MUST NOT have "extends": "@living-architecture/riviere-extract-conventions"
- MUST NOT have "hasDecorator" with convention package decorator names (UseCase, APIContainer, etc.)

SOURCE RULES:
- Components must use JSDoc tags like /** @useCase */, /** @eventHandler */, /** @api */, /** @event */, /** @domainOp */
- MUST NOT import from @living-architecture/riviere-extract-conventions (grep for this string in ALL files)

PACKAGE.JSON:
- MUST NOT list @living-architecture/riviere-extract-conventions as a dependency

OUTPUT FORMAT:
# Shipping Domain Compliance Report
## Config: [PASS/FAIL]
[details]
## Source: [PASS/FAIL]
[details]
## Import Ban: [PASS/FAIL]
[details]
## Violations
[list or "None"]
```

---

## Agent 3: Inventory Domain (Custom Decorators)

```
You are auditing the INVENTORY domain for extraction strategy compliance. This domain uses custom locally-defined decorators.

FILES TO READ:
- .riviere/config/inventory.extraction.json
- inventory-domain/package.json
- inventory-domain/src/decorators.ts
- All .ts files under inventory-domain/src/

CONFIG RULES:
- MUST use "hasDecorator" detection with custom names: StockUseCase, StockHandler, StockOp, StockAPI, StockEvent
- Decorator entries MUST NOT have a "from" field pointing to @living-architecture/riviere-extract-conventions
- MUST NOT have "extends" key

SOURCE RULES:
- Must have a local decorators.ts defining StockUseCase, StockHandler, StockOp, StockAPI, StockEvent
- Components must import decorators from local path (e.g. '../decorators')
- MUST NOT import from @living-architecture/riviere-extract-conventions (grep ALL files)

PACKAGE.JSON:
- MUST NOT list @living-architecture/riviere-extract-conventions as a dependency

OUTPUT FORMAT:
# Inventory Domain Compliance Report
## Config: [PASS/FAIL]
[details]
## Source: [PASS/FAIL]
[details]
## Import Ban: [PASS/FAIL]
[details]
## Violations
[list or "None"]
```

---

## Agent 4: Payment Domain (Interface-Based)

```
You are auditing the PAYMENT domain for extraction strategy compliance. This domain uses interface-based detection.

FILES TO READ:
- .riviere/config/payment.extraction.json
- payment-domain/package.json
- All .ts files under payment-domain/src/

CONFIG RULES:
- MUST use "implementsInterface" detection with names like IPaymentUseCase, IPaymentEventHandler, IPaymentDomainOp, IPaymentEvent
- MUST NOT have "extends" key
- MUST NOT have "hasDecorator" with convention names

SOURCE RULES:
- Components must use implements clauses with domain-specific interfaces
- MUST NOT import from @living-architecture/riviere-extract-conventions (grep ALL files)

PACKAGE.JSON:
- MUST NOT list @living-architecture/riviere-extract-conventions as a dependency

OUTPUT FORMAT:
# Payment Domain Compliance Report
## Config: [PASS/FAIL]
[details]
## Source: [PASS/FAIL]
[details]
## Import Ban: [PASS/FAIL]
[details]
## Violations
[list or "None"]
```

---

## Agent 5: Notifications Domain (Base Class)

```
You are auditing the NOTIFICATIONS domain for extraction strategy compliance. This domain uses base class extension for detection.

FILES TO READ:
- .riviere/config/notifications.extraction.json
- notifications-domain/package.json
- All .ts files under notifications-domain/src/

CONFIG RULES:
- MUST use "extendsClass" detection with names like BaseNotificationUseCase, BaseNotificationDomainOp
- May use "nameMatches" for handlers
- MUST NOT have "extends": "@living-architecture/riviere-extract-conventions"
- MUST NOT have "hasDecorator" with convention names

SOURCE RULES:
- Components must extend base classes (BaseNotificationUseCase, etc.)
- MUST NOT import from @living-architecture/riviere-extract-conventions (grep ALL files)

PACKAGE.JSON:
- MUST NOT list @living-architecture/riviere-extract-conventions as a dependency

OUTPUT FORMAT:
# Notifications Domain Compliance Report
## Config: [PASS/FAIL]
[details]
## Source: [PASS/FAIL]
[details]
## Import Ban: [PASS/FAIL]
[details]
## Violations
[list or "None"]
```

---

## Agent 6: BFF Domain (Mixed Strategy)

```
You are auditing the BFF domain for extraction strategy compliance. This domain uses a mix of strategies per component type.

FILES TO READ:
- .riviere/config/bff.extraction.json
- bff/package.json
- All .ts files under bff/src/

CONFIG RULES:
- MUST use "nameEndsWith" for useCases
- MUST use "hasJSDoc" for api (tag: "bffApi")
- MUST NOT have "extends": "@living-architecture/riviere-extract-conventions"

SOURCE RULES:
- UseCase classes must end with "UseCase" suffix
- API classes must have /** @bffApi */ JSDoc tag
- MUST NOT import from @living-architecture/riviere-extract-conventions (grep ALL files)

PACKAGE.JSON:
- MUST NOT list @living-architecture/riviere-extract-conventions as a dependency

OUTPUT FORMAT:
# BFF Domain Compliance Report
## Config: [PASS/FAIL]
[details]
## Source: [PASS/FAIL]
[details]
## Import Ban: [PASS/FAIL]
[details]
## Violations
[list or "None"]
```

---

## Agent 7: UI Domain (Name-Based)

```
You are auditing the UI domain for extraction strategy compliance. This domain uses name-based detection (*Page suffix).

FILES TO READ:
- .riviere/config/ui.extraction.json
- ui/package.json (if exists)
- All .tsx files under ui/src/

CONFIG RULES:
- MUST use "nameEndsWith" for ui components (suffix: "Page")
- Most other component types should be "notUsed": true
- MUST NOT have "extends": "@living-architecture/riviere-extract-conventions"

SOURCE RULES:
- UI component classes must end with "Page" suffix
- MUST NOT import from @living-architecture/riviere-extract-conventions (grep ALL files)

OUTPUT FORMAT:
# UI Domain Compliance Report
## Config: [PASS/FAIL]
[details]
## Source: [PASS/FAIL]
[details]
## Import Ban: [PASS/FAIL]
[details]
## Violations
[list or "None"]
```

---

## Cross-Cutting Check

After the 7 agents complete, also check:
- `.dependency-cruiser.cjs` has a rule preventing non-orders domains from importing `@living-architecture/riviere-extract-conventions`
- `extraction.config.json` at root references all 7 domain configs via `$ref`

## Final Output

Aggregate all 7 reports into:

```
# Extraction Strategy Compliance Report

## Summary
| Domain | Config | Source | Import Ban | Status |
|--------|--------|--------|------------|--------|
| orders | PASS/FAIL | PASS/FAIL | N/A | ... |
| shipping | PASS/FAIL | PASS/FAIL | PASS/FAIL | ... |
| ... | ... | ... | ... | ... |

## Critical Violations
[List all violations across all domains]

## Recommendations
[Specific fixes for any violations found]
```
