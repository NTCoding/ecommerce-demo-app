#!/usr/bin/env node
/**
 * Verify extraction output matches expected components.
 * Uses riviere CLI (the real workflow).
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

function main() {
  // Load expected output
  const expectedPath = resolve(rootDir, 'expected-extraction-output.json')
  const expected = JSON.parse(readFileSync(expectedPath, 'utf-8'))

  console.log('Running extraction via CLI...')

  // Run CLI and capture output
  let cliOutput
  try {
    cliOutput = execSync('npx riviere extract --config extraction.config.json', {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 60000,
    })
  } catch (error) {
    console.error('❌ CLI extraction failed!')
    console.error('')
    console.error('Command: npx riviere extract --config extraction.config.json')
    console.error('')
    if (error.stdout) console.error('stdout:', error.stdout)
    if (error.stderr) console.error('stderr:', error.stderr)
    if (error.message) console.error('error:', error.message)
    process.exit(1)
  }

  // Parse CLI output as JSON
  let components
  try {
    const result = JSON.parse(cliOutput)
    components = result.components || result
  } catch (error) {
    console.error('❌ Failed to parse CLI output as JSON!')
    console.error('')
    console.error('Raw output:')
    console.error(cliOutput)
    process.exit(1)
  }

  console.log(`Extracted ${components.length} components`)

  // Normalize for comparison (only type, name, domain - ignore location details)
  const normalize = (comps) =>
    comps
      .map((c) => ({ type: c.type, name: c.name, domain: c.domain }))
      .sort((a, b) => `${a.domain}:${a.name}`.localeCompare(`${b.domain}:${b.name}`))

  const actualNormalized = normalize(components)
  const expectedNormalized = normalize(expected.components)

  // Compare
  const actualJson = JSON.stringify(actualNormalized, null, 2)
  const expectedJson = JSON.stringify(expectedNormalized, null, 2)

  if (actualJson === expectedJson) {
    console.log(`✅ Extraction verified: ${actualNormalized.length} components match expected output`)
    process.exit(0)
  } else {
    console.error('❌ Extraction mismatch!')
    console.error('')

    // Show diff
    const expectedNames = new Set(expectedNormalized.map((c) => `${c.domain}:${c.name}`))
    const actualNames = new Set(actualNormalized.map((c) => `${c.domain}:${c.name}`))

    const missing = [...expectedNames].filter((n) => !actualNames.has(n))
    const extra = [...actualNames].filter((n) => !expectedNames.has(n))

    if (missing.length > 0) {
      console.error('Missing components (expected but not found):')
      missing.forEach((n) => console.error(`  - ${n}`))
    }
    if (extra.length > 0) {
      console.error('Extra components (found but not expected):')
      extra.forEach((n) => console.error(`  + ${n}`))
    }

    console.error('')
    console.error(`Expected: ${expectedNormalized.length} components`)
    console.error(`Actual: ${actualNormalized.length} components`)

    process.exit(1)
  }
}

main()
