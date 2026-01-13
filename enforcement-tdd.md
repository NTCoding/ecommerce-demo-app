# Enforcement TDD Methodology

## Purpose

This methodology ensures extraction configuration is reliable and trustworthy.

**The problem it solves:** Extraction rules can silently fail. A developer adds a component without the required convention, extraction misses it, and nobody notices until the architecture diagram is wrong. By then, trust is lost.

**The solution:** Enforcement tests that verify source code conventions. If a developer can add a component without following the convention and no test fails, the extraction is unreliable.

**The guarantee:** After following this methodology, you can be confident that:
- Every component matching the extraction rule follows the convention
- Adding a component without the convention causes a test failure
- Extraction output matches what enforcement verifies

## Concepts

**Enforcement Test** = A test that scans source code and fails if any component violates the required convention.

**Extraction Rule** = Configuration that tells the CLI how to find components (e.g., "find classes with @UseCase decorator").

**Convention** = The pattern that identifies a component type (e.g., "all use cases must have @UseCase decorator").

**The relationship:** Enforcement tests and extraction rules must describe the SAME convention. If they diverge, the system is broken.

## The Cycle

### Step 1: Define the Convention

Before writing any code, clearly define:
- **What** is being enforced (e.g., UseCase classes must have @UseCase decorator)
- **Where** it applies (e.g., `orders-domain/src/**/use-cases/*.ts`)
- **Exclusions** (e.g., abstract base classes, test fixtures, index files)

Document this in the test file as a comment.

### Step 2: Write Enforcement Test

Write a test that verifies the convention. Include exclusion handling.

```typescript
/**
 * Convention: All use case classes in orders-domain must have @UseCase decorator
 * Path: orders-domain/src/**/use-cases/*.ts
 * Exclusions: index.ts, *.test.ts, abstract base classes
 */
test('orders-domain: UseCase classes must have @UseCase decorator', () => {
  const files = glob('orders-domain/src/**/use-cases/*.ts', {
    ignore: ['**/index.ts', '**/*.test.ts', '**/__fixtures__/**']
  })

  const violations = []

  for (const file of files) {
    for (const cls of getClasses(file)) {
      // Skip abstract classes
      if (isAbstract(cls)) continue

      if (!hasDecorator(cls, 'UseCase')) {
        violations.push(`${file}:${cls.line} - ${cls.name} missing @UseCase decorator`)
      }
    }
  }

  expect(violations).toEqual([])
})
```

### Step 3: Verify Test Can Fail (RED)

**This step is mandatory. No exceptions.**

Create a deliberate violation in a dedicated fixtures directory:

```typescript
// Create: orders-domain/src/__test-violations__/use-cases/bad-use-case.ts
export class BadUseCase {  // No @UseCase decorator
  execute() {}
}
```

Run the test. It **MUST** fail with a clear message showing:
- File path
- Line number
- Class name
- What's missing

```
FAIL: orders-domain/src/__test-violations__/use-cases/bad-use-case.ts:1 - BadUseCase missing @UseCase decorator
```

**If the test passes, the test is broken.** Fix the test and repeat.

### Step 4: Verify Test Catches Multiple Violation Types

One violation is not enough. The test must catch different failure modes:

| Violation Type | Test File | Expected Failure |
|---------------|-----------|------------------|
| Missing decorator | `bad-no-decorator.ts` | "missing @UseCase decorator" |
| Wrong decorator | `bad-wrong-decorator.ts` with `@WrongDecorator` | "missing @UseCase decorator" |
| Misspelled decorator | `bad-typo.ts` with `@Usecase` | "missing @UseCase decorator" |

Create each violation, run test, confirm failure. Remove violation after confirming.

### Step 5: Verify Test Does NOT Fail on Valid Code (False Positive Check)

Ensure the test passes legitimate cases:

| Valid Case | Test File | Expected Result |
|------------|-----------|-----------------|
| Correct decorator | `good-use-case.ts` with `@UseCase` | PASS |
| Abstract base class | `abstract-base.ts` (abstract, no decorator) | PASS (excluded) |
| Index file | `index.ts` (exports, no decorator) | PASS (excluded) |

If the test fails on valid code, fix the exclusion logic.

### Step 6: Document RED Evidence

Record in the test file or adjacent markdown:
- Date RED was verified
- Which violation types were tested
- Screenshot or log of failure message

```typescript
/**
 * RED verified: 2024-01-15
 * Violations tested: missing decorator, wrong decorator, misspelled decorator
 * False positive check: abstract classes, index files
 */
```

### Step 7: GREEN - Fix Real Violations

Run the enforcement test against the actual codebase. If violations exist:

1. **List all violations** - don't fix one at a time
2. **Review each** - is it a real violation or missing exclusion?
3. **Fix violations** - add required decorators/conventions
4. **Run test** - must pass
5. **Run existing tests** - ensure fixes didn't break functionality

**Rollback plan:** If fixes break functionality, revert and add exclusion with TODO comment explaining why.

### Step 8: Add Extraction Rule

Only AFTER enforcement passes, add the extraction config:

```json
{
  "name": "orders",
  "path": "orders-domain/src/**/use-cases/*.ts",
  "useCase": {
    "find": "classes",
    "where": { "hasDecorator": { "name": "UseCase" } }
  }
}
```

**The extraction rule must match the enforcement test convention exactly.**

### Step 9: Verify Extraction Matches Enforcement

Run extraction and compare to enforcement:

```bash
# Get enforcement count
npm run test:enforcement -- --grep "orders-domain: UseCase" --json | jq '.numPassedTests'

# Get extraction count
npm run extract | jq '[.data[] | select(.type == "useCase" and .domain == "orders")] | length'
```

**Match criteria:**
- Same count of components
- Same component names
- Same file locations

If they don't match:
- **Extraction finds MORE**: Extraction rule is too broad, or enforcement exclusions are wrong
- **Extraction finds FEWER**: Extraction rule is too narrow, or enforcement is checking files extraction doesn't see

Fix the discrepancy before proceeding.

### Step 10: REFACTOR

After GREEN, refactor for maintainability:

- **Extract shared utilities** if multiple tests follow same pattern
- **Consolidate similar tests** if they check the same convention differently
- **Improve error messages** to be more actionable
- **Add performance optimizations** if test suite is slow

### Step 11: Add Sync Check

Create a test that verifies enforcement and extraction stay synchronized:

```typescript
test('Enforcement and extraction are synchronized for orders/useCase', () => {
  const enforcedComponents = getEnforcedUseCases('orders-domain')
  const extractedComponents = runExtraction()
    .filter(c => c.type === 'useCase' && c.domain === 'orders')

  expect(extractedComponents.map(c => c.name).sort())
    .toEqual(enforcedComponents.map(c => c.name).sort())
})
```

This test fails if enforcement or extraction changes independently.

## Order of Operations

One component type. One domain. Full cycle.

1. orders/useCase - full cycle (Steps 1-11)
2. orders/eventHandler - full cycle
3. orders/domainOp - full cycle
4. orders/api - full cycle
5. shipping/useCase - full cycle
6. ... continue for all domains and types

**Why sequential?** Each cycle proves the methodology works before scaling. Parallel work can begin after first domain is complete.

## Approval Gates

Get explicit user approval at these checkpoints:

| Checkpoint | What User Verifies |
|------------|-------------------|
| After Step 6 (RED documented) | "I saw the test fail with clear error messages for multiple violation types" |
| After Step 7 (GREEN) | "All violations fixed, existing tests still pass" |
| After Step 9 (Match verified) | "Extraction count matches enforcement count, same components" |
| After Step 11 (Sync check added) | "Ready for next component type" |

## Handling Edge Cases

### Legitimate Non-Decorated Classes

Some classes legitimately don't need the decorator:
- Abstract base classes
- Test fixtures
- Generated code
- Legacy code (temporarily)

**Solution:** Add to exclusions with documented reason:

```typescript
const EXCLUSIONS = {
  '**/index.ts': 'Re-export files, no classes',
  '**/*.test.ts': 'Test files',
  '**/BaseUseCase.ts': 'Abstract base class - decorators on subclasses',
}
```

### Legacy/Gradual Migration

If a domain can't be fully migrated:

1. Create `legacy-exclusions.json` listing excluded files with reasons
2. Add exclusions to enforcement test
3. Create tracking issue to remove each exclusion
4. Set deadline for full compliance

**Never** create a separate unmonitored folder for legacy code.

### Decorator Detection Edge Cases

The `hasDecorator()` function must handle:
- Aliased imports (`import { UseCase as UC }`)
- Decorators from different packages
- Decorators with parameters (`@UseCase({ name: 'foo' })`)

**Verify** by adding test cases for each edge case in Step 4.

## What Happens If You Skip Steps

| Skipped Step | Consequence |
|--------------|-------------|
| Skip RED | Test might be broken - false confidence |
| Skip multiple violation types | Test catches one type, misses others |
| Skip false positive check | Test fails on valid code, developers disable it |
| Skip extraction match | Extraction silently diverges from enforcement |
| Skip sync check | Future changes break synchronization |

## Success Criteria Per Component Type

- [ ] Convention defined and documented
- [ ] Enforcement test written with exclusions
- [ ] RED verified with multiple violation types
- [ ] False positive check passed
- [ ] RED evidence documented
- [ ] All real violations fixed (GREEN)
- [ ] Extraction rule added
- [ ] Extraction matches enforcement
- [ ] Tests refactored if needed
- [ ] Sync check added
