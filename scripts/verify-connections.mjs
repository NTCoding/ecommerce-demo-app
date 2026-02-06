#!/usr/bin/env node
/**
 * Verify extracted connections match expected ground truth.
 * Uses riviere CLI (the real workflow).
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

function main() {
  const expectedPath = resolve(rootDir, 'expected-connections.json')
  const expected = JSON.parse(readFileSync(expectedPath, 'utf-8'))

  console.log('Running extraction via CLI...')

  let cliOutput
  try {
    cliOutput = execSync('npx riviere extract --config extraction.config.json --allow-incomplete', {
      cwd: rootDir,
      encoding: 'utf-8',
      timeout: 60000,
    })
  } catch (error) {
    console.error('CLI extraction failed!')
    console.error('')
    console.error('Command: npx riviere extract --config extraction.config.json --allow-incomplete')
    if (error.stdout) console.error('stdout:', error.stdout)
    if (error.stderr) console.error('stderr:', error.stderr)
    if (error.message) console.error('error:', error.message)
    process.exit(1)
  }

  let links
  try {
    const jsonLine = cliOutput.split('\n').find((line) => line.startsWith('{'))
    const result = JSON.parse(jsonLine)
    links = result.data?.links || result.links || []
  } catch (error) {
    console.error('Failed to parse CLI output as JSON!')
    console.error('')
    console.error('Raw output:')
    console.error(cliOutput)
    process.exit(1)
  }

  // Filter out uncertain links (those with _uncertain field or _unresolved target)
  const certainLinks = links.filter((l) => l._uncertain === undefined && l.target !== '_unresolved')

  console.log(`Extracted ${links.length} total links (${certainLinks.length} certain, ${links.length - certainLinks.length} uncertain)`)

  // Normalize to comparable tuples
  const toTuple = (l) => `${l.source}|${l.target}|${l.type}`

  const actualSet = new Set(certainLinks.map(toTuple))
  const expectedSet = new Set(expected.links.map(toTuple))

  const missing = [...expectedSet].filter((t) => !actualSet.has(t))
  const extra = [...actualSet].filter((t) => !expectedSet.has(t))

  if (missing.length === 0 && extra.length === 0) {
    console.log(`Connections verified: ${expectedSet.size} connections match ground truth (zero diff)`)
    process.exit(0)
  }

  console.error('Connection mismatch!')
  console.error('')

  if (missing.length > 0) {
    console.error(`Missing connections (${missing.length} false negatives):`)
    missing.forEach((t) => {
      const [source, target, type] = t.split('|')
      console.error(`  - [${type}] ${source} -> ${target}`)
    })
  }

  if (extra.length > 0) {
    console.error(`Extra connections (${extra.length} false positives):`)
    extra.forEach((t) => {
      const [source, target, type] = t.split('|')
      console.error(`  + [${type}] ${source} -> ${target}`)
    })
  }

  console.error('')
  console.error(`Expected: ${expectedSet.size} connections`)
  console.error(`Actual: ${actualSet.size} certain connections`)

  process.exit(1)
}

main()
