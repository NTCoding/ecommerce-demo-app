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

---

## 🚫 ABSOLUTE RULE: ZERO LOCAL DEPENDENCIES

### DO NOT — EVER — USE LOCAL PACKAGE LINKS

**This repo MUST ONLY depend on published npm packages. Period. No exceptions.**

**Forbidden patterns:**
- ❌ `link:../living-architecture/...` in pnpm-lock.yaml
- ❌ `file:../some/local/path` in pnpm-lock.yaml
- ❌ Any workspace protocol pointing outside this repo
- ❌ Manual edits to package.json `overrides` section
- ❌ Running `pnpm link` to connect to local packages
- ❌ Any scheme to "temporarily" use local code

### Why This Rule Is Absolute

1. **CI depends on published packages** — local links break CI
2. **Real users only have published packages** — local links hide bugs that would break users
3. **This repo IS the test of whether packages work** — if you can only make it work with local code, the package is broken
4. **Packages must pass through npm to be validated** — local bypasses defeat quality gates

### What To Do Instead

**If you need unreleased changes:**
1. ✅ Make the change in living-architecture repo
2. ✅ Publish a new npm version (0.8.8, 0.9.0, etc.)
3. ✅ Update dependency: `pnpm update @living-architecture/<package>`
4. ✅ Verify it works here

**Never:**
- Don't use local links as a "temporary" measure
- Don't say "I'll publish later"
- Don't assume "it'll work when published"
- Don't try to make CI handle local paths differently

### Validation

A pre-commit hook runs `npm run validate:deps` which will **reject any commit** that contains local package links. This cannot be bypassed. If you see this error:

```
❌ DEPENDENCY VIOLATION: Local package overrides forbidden
```

**Fix the root cause, don't work around it.** Remove local links, publish the package, update the dependency.

---

## Dependencies

This project depends on **published npm packages ONLY**:

- `@living-architecture/riviere-cli` - Extraction CLI (from npm registry)
- `@living-architecture/riviere-extract-conventions` - Default decorators (from npm registry)

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

---

## 🔒 GROUND TRUTH FILES: READ-ONLY FOR CLAUDE

### DO NOT MODIFY THESE FILES

**Claude cannot and will not edit these files:**
- ❌ `expected-extraction-output.json`
- ❌ `expected-connections.json`

**Why:**
- These define ground truth verified by **manual code inspection**
- Ground truth is the specification for correctness
- If Claude modifies them, ground truth becomes corrupted
- Once corrupted, the repo has no validation of the extraction tool

**What happens if verification fails:**
1. ✅ Tool extracts 61 connections, ground truth specifies 77
2. ✅ Verification correctly FAILS
3. ❌ WRONG: Claude edits ground truth to match tool output (57 connections)
4. ❌ Result: No more validation, bugs ship to users

**Correct response to verification failure:**
1. Tool extracts 61/77 connections
2. Verification FAILS (correct!)
3. Create specification for engineer to fix extraction tool
4. Engineer fixes living-architecture package
5. Publish new version
6. Tool now extracts 77/77 connections
7. Verification PASSES

**If Claude is tempted to "fix" ground truth:**
- This is a workaround (forbidden by CLAUDE.md mandatory protocol)
- Ground truth represents reality, not a number to tweak
- Modification would hide product bugs
- Users would receive broken tool

### The Sacred Rule

Ground truth files must remain locked to reality. If tool output doesn't match, the tool is broken—not the ground truth.

---

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
