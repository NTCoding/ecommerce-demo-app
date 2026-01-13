#!/usr/bin/env node
/**
 * Architectural extraction tests - one test per component type.
 * Each test verifies extraction finds all expected components of that type.
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// Load expected components
const expectedPath = resolve(rootDir, 'expected-extraction-output.json')
const expected = JSON.parse(readFileSync(expectedPath, 'utf-8'))

// Run extraction once
function runExtraction() {
  const cliOutput = execSync('npx riviere extract --config extraction.config.json', {
    cwd: rootDir,
    encoding: 'utf-8',
    timeout: 60000,
  })
  const result = JSON.parse(cliOutput)
  return result.data || result.components || result
}

// Test runner
const tests = []
let extracted = null

function test(name, fn) {
  tests.push({ name, fn })
}

function runTests() {
  console.log('Running architectural extraction tests...\n')

  // Run extraction once for all tests
  try {
    extracted = runExtraction()
    console.log(`Extracted ${extracted.length} total components\n`)
  } catch (error) {
    console.error('FATAL: Extraction failed')
    console.error(error.message)
    process.exit(1)
  }

  let passed = 0
  let failed = 0
  const failures = []

  for (const { name, fn } of tests) {
    try {
      const result = fn()
      if (result.pass) {
        console.log(`  ✅ ${name}`)
        passed++
      } else {
        console.log(`  ❌ ${name}`)
        failed++
        failures.push({ name, ...result })
      }
    } catch (error) {
      console.log(`  ❌ ${name} (error: ${error.message})`)
      failed++
      failures.push({ name, error: error.message })
    }
  }

  console.log(`\n${passed} passed, ${failed} failed\n`)

  // Show failure details
  if (failures.length > 0) {
    console.log('FAILURES:\n')
    for (const f of failures) {
      console.log(`--- ${f.name} ---`)
      if (f.missing?.length > 0) {
        console.log('Missing:')
        f.missing.forEach(c => console.log(`  - ${c.domain}:${c.name}`))
      }
      if (f.extra?.length > 0) {
        console.log('Extra (unexpected):')
        f.extra.forEach(c => console.log(`  + ${c.domain}:${c.name}`))
      }
      if (f.error) {
        console.log(`Error: ${f.error}`)
      }
      console.log('')
    }
  }

  process.exit(failed > 0 ? 1 : 0)
}

// Helper to compare components of a specific type
function verifyComponentType(type) {
  const expectedOfType = expected.components
    .filter(c => c.type === type)
    .map(c => ({ type: c.type, name: c.name, domain: c.domain }))
    .sort((a, b) => `${a.domain}:${a.name}`.localeCompare(`${b.domain}:${b.name}`))

  const actualOfType = extracted
    .filter(c => c.type === type)
    .map(c => ({ type: c.type, name: c.name, domain: c.domain }))
    .sort((a, b) => `${a.domain}:${a.name}`.localeCompare(`${b.domain}:${b.name}`))

  const expectedSet = new Set(expectedOfType.map(c => `${c.domain}:${c.name}`))
  const actualSet = new Set(actualOfType.map(c => `${c.domain}:${c.name}`))

  const missing = expectedOfType.filter(c => !actualSet.has(`${c.domain}:${c.name}`))
  const extra = actualOfType.filter(c => !expectedSet.has(`${c.domain}:${c.name}`))

  return {
    pass: missing.length === 0 && extra.length === 0,
    expected: expectedOfType.length,
    actual: actualOfType.length,
    missing,
    extra
  }
}

// Define tests - one per component type
test('should extract all UseCases (21)', () => verifyComponentType('useCase'))
test('should extract all EventHandlers (15)', () => verifyComponentType('eventHandler'))
test('should extract all DomainOps (23)', () => verifyComponentType('domainOp'))
test('should extract all APIs (5)', () => verifyComponentType('api'))
test('should extract all UI components (1)', () => verifyComponentType('ui'))

// Run
runTests()
