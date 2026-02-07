#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const lockfilePath = path.join(__dirname, '../pnpm-lock.yaml')

const lockfileContent = fs.readFileSync(lockfilePath, 'utf-8')
const lines = lockfileContent.split('\n')

let violations = []

// Check for local link overrides in overrides section or in version specifiers
lines.forEach((line, idx) => {
  const lineNum = idx + 1

  if (line.includes('link:../')) {
    // Extract context: package name and full path
    let packageName = 'unknown'
    let fullPath = line.trim()

    // Look backwards for package name
    for (let i = idx; i >= Math.max(0, idx - 5); i--) {
      const contextLine = lines[i]
      if (contextLine.includes(':') && !contextLine.includes('link:')) {
        const match = contextLine.match(/['"]?(@?[a-zA-Z0-9\-\/]+)['"]?\s*:/)
        if (match) {
          packageName = match[1]
          break
        }
      }
    }

    violations.push({
      line: lineNum,
      package: packageName,
      fullLine: line,
      principle: 'CLAUDE.md: "not local versions"'
    })
  }

  if (line.includes('file:../')) {
    violations.push({
      line: lineNum,
      package: 'unknown',
      fullLine: line,
      principle: 'Only published npm packages allowed'
    })
  }
})

if (violations.length > 0) {
  console.error('\n❌ DEPENDENCY VIOLATION: Local package overrides forbidden\n')
  console.error('Your CLAUDE.md states: "This project depends on these npm packages (not local versions)"\n')

  violations.forEach((v, idx) => {
    console.error(`Violation ${idx + 1}:`)
    console.error(`  Package: ${v.package}`)
    console.error(`  Line ${v.line}: ${v.fullLine.trim()}`)
    console.error(`  Principle: ${v.principle}\n`)
  })

  console.error('SOLUTION:')
  console.error('  1. Remove the "overrides:" section from pnpm-lock.yaml (if present)')
  console.error('  2. Run: pnpm install')
  console.error('  3. This will regenerate pnpm-lock.yaml using published npm packages only\n')
  process.exit(1)
}

console.log('✅ Dependencies valid: no local overrides detected')
process.exit(0)
