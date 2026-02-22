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
    cliOutput = execSync('npx riviere extract --config .riviere/config/extraction.config.json --allow-incomplete', {
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
  let externalLinks
  try {
    const jsonLine = cliOutput.split('\n').find((line) => line.startsWith('{'))
    const result = JSON.parse(jsonLine)
    links = result.data?.links || result.links || []
    externalLinks = result.data?.externalLinks || result.externalLinks || []
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
  console.log(`Extracted ${externalLinks.length} external links`)

  // Normalize to comparable tuples
  const toLinkTuple = (l) => `${l.source}|${l.target}|${l.type}`
  const toExternalTuple = (l) => `${l.source}|${l.target.name}|${l.type}`

  const actualSet = new Set(certainLinks.map(toLinkTuple))
  const expectedSet = new Set(expected.links.map(toLinkTuple))

  const missingLinks = [...expectedSet].filter((t) => !actualSet.has(t))
  const extraLinks = [...actualSet].filter((t) => !expectedSet.has(t))

  const expectedExternalLinks = expected.externalLinks || []
  const actualExternalSet = new Set(externalLinks.map(toExternalTuple))
  const expectedExternalSet = new Set(expectedExternalLinks.map(toExternalTuple))

  const missingExternal = [...expectedExternalSet].filter((t) => !actualExternalSet.has(t))
  const extraExternal = [...actualExternalSet].filter((t) => !expectedExternalSet.has(t))

  const totalMissing = missingLinks.length + missingExternal.length
  const totalExtra = extraLinks.length + extraExternal.length

  if (totalMissing === 0 && totalExtra === 0) {
    console.log(`Connections verified: ${expectedSet.size} links + ${expectedExternalSet.size} external links match ground truth (zero diff)`)
    process.exit(0)
  }

  console.error('Connection mismatch!')
  console.error('')

  if (missingLinks.length > 0) {
    console.error(`Missing connections (${missingLinks.length} false negatives):`)
    missingLinks.forEach((t) => {
      const [source, target, type] = t.split('|')
      console.error(`  - [${type}] ${source} -> ${target}`)
    })
  }

  if (missingExternal.length > 0) {
    console.error(`Missing external links (${missingExternal.length} false negatives):`)
    missingExternal.forEach((t) => {
      const [source, targetName, type] = t.split('|')
      console.error(`  - [${type}] ${source} -> ${targetName} (external)`)
    })
  }

  if (extraLinks.length > 0) {
    console.error(`Extra connections (${extraLinks.length} false positives):`)
    extraLinks.forEach((t) => {
      const [source, target, type] = t.split('|')
      console.error(`  + [${type}] ${source} -> ${target}`)
    })
  }

  if (extraExternal.length > 0) {
    console.error(`Extra external links (${extraExternal.length} false positives):`)
    extraExternal.forEach((t) => {
      const [source, targetName, type] = t.split('|')
      console.error(`  + [${type}] ${source} -> ${targetName} (external)`)
    })
  }

  console.error('')
  console.error(`Expected: ${expectedSet.size} links + ${expectedExternalSet.size} external links`)
  console.error(`Actual: ${actualSet.size} certain links + ${actualExternalSet.size} external links`)

  process.exit(1)
}

main()
