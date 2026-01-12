#!/usr/bin/env node
/**
 * Verify extraction output matches expected components.
 * Uses riviere-extract-ts directly (bypasses CLI).
 */

import { extractComponents, resolveConfig } from '@living-architecture/riviere-extract-ts'
import { isValidExtractionConfig } from '@living-architecture/riviere-extract-config'
import { Project } from 'ts-morph'
import { globSync } from 'glob'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// Simple config loader (our config doesn't use extends)
const noopConfigLoader = () => {
  throw new Error('Config extends not supported in verification script')
}

async function main() {
  // Load config
  const configPath = resolve(rootDir, 'extraction.config.json')
  const config = JSON.parse(readFileSync(configPath, 'utf-8'))

  // Validate config
  if (!isValidExtractionConfig(config)) {
    console.error('Invalid extraction config')
    process.exit(1)
  }

  // Load expected output
  const expectedPath = resolve(rootDir, 'expected-extraction-output.json')
  const expected = JSON.parse(readFileSync(expectedPath, 'utf-8'))

  console.log('Running extraction...')

  // Resolve config (handles extends)
  const resolvedConfig = resolveConfig(config, noopConfigLoader)

  // Save original patterns for globbing
  const originalPatterns = resolvedConfig.modules.map((m) => m.path)

  // Find source files using original patterns
  const sourceFilePaths = originalPatterns.flatMap((pattern) => globSync(pattern, { cwd: rootDir }))

  // Absolute paths for ts-morph project
  const absolutePaths = sourceFilePaths.map((filePath) => resolve(rootDir, filePath))

  // Update module paths to match absolute paths (prepend **/)
  resolvedConfig.modules.forEach((m) => {
    m.path = '**/' + m.path
  })

  if (absolutePaths.length === 0) {
    console.error('No source files found!')
    process.exit(1)
  }

  console.log(`Found ${absolutePaths.length} source files`)

  // Create ts-morph project and add files
  const project = new Project({
    compilerOptions: {
      rootDir: rootDir,
    },
  })

  for (const absPath of absolutePaths) {
    project.addSourceFileAtPath(absPath)
  }

  // Run extraction using absolute paths
  const components = extractComponents(project, absolutePaths, resolvedConfig)

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

main().catch((err) => {
  console.error('Extraction failed:', err.message)
  console.error(err.stack)
  process.exit(1)
})
