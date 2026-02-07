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
  console.error('\n' + '='.repeat(80))
  console.error('🚫 CRITICAL: LOCAL PACKAGE DEPENDENCIES DETECTED')
  console.error('='.repeat(80) + '\n')

  console.error('❌ VIOLATION: This repository must ONLY use published npm packages.')
  console.error('   Local package links are FORBIDDEN and cannot be committed.\n')

  console.error('PRINCIPLE (from CLAUDE.md):')
  console.error('  "This project depends on these npm packages (not local versions)"')
  console.error('  "This rule is ABSOLUTE. There are NO EXCEPTIONS."\n')

  console.error('VIOLATIONS FOUND:\n')
  violations.forEach((v, idx) => {
    console.error(`  ${idx + 1}. Package: ${v.package}`)
    console.error(`     Line ${v.line}: ${v.fullLine.trim()}`)
    console.error(`     ⚠️  This breaks CI and hides bugs from real users\n`)
  })

  console.error('YOU MUST FIX THIS — DO NOT WORK AROUND IT:\n')
  console.error('  ❌ DO NOT try to bypass this check')
  console.error('  ❌ DO NOT commit with --no-verify')
  console.error('  ❌ DO NOT modify this validation script')
  console.error('  ❌ DO NOT use "temporary" local links\n')

  console.error('✅ CORRECT APPROACH:\n')
  console.error('  1. Edit: living-architecture package that needs changes')
  console.error('  2. Publish: npm publish (new version)')
  console.error('  3. Update: pnpm update @living-architecture/<package>')
  console.error('  4. Verify: Tests pass here in ecommerce-demo-app\n')

  console.error('Quick fix for immediate issue:')
  console.error('  1. Remove the "overrides:" section from pnpm-lock.yaml')
  console.error('  2. Run: pnpm install')
  console.error('  3. Commit the regenerated lock file\n')

  console.error('='.repeat(80) + '\n')
  process.exit(1)
}

console.log('✅ Dependencies valid: no local overrides detected')
process.exit(0)
