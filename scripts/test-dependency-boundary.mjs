#!/usr/bin/env node

/**
 * Tests that dependency-cruiser correctly blocks convention imports from non-orders domains.
 * Creates a temporary violation file, runs depcruise, verifies it fails, then cleans up.
 */

import { writeFileSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'

const VIOLATION_FILE = 'shipping-domain/src/__test-depcruise-violation.ts'
const VIOLATION_CONTENT = `import { EventHandlerContainer } from '@living-architecture/riviere-extract-conventions'\nexport const unused = EventHandlerContainer\n`

try {
  // Create violation file
  writeFileSync(VIOLATION_FILE, VIOLATION_CONTENT)

  // Run depcruise — should fail
  try {
    execSync('npm run lint:deps', { stdio: 'pipe' })
    // If we get here, depcruise didn't catch the violation
    console.error('FAIL: dependency-cruiser did not detect convention import violation')
    process.exit(1)
  } catch (error) {
    if (error.stdout?.toString().includes('no-conventions-outside-orders')) {
      console.log('PASS: dependency-cruiser correctly blocks convention imports from non-orders domains')
    } else {
      console.error('FAIL: depcruise failed but not with expected rule violation')
      console.error(error.stderr?.toString())
      process.exit(1)
    }
  }
} finally {
  try { unlinkSync(VIOLATION_FILE) } catch { /* ignore */ }
}
