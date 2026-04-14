#!/usr/bin/env node
/**
 * Updates all @living-architecture/* packages to their latest published versions
 * across every package in the repo that depends on them.
 *
 * Runs as a pre-commit hook to ensure no stale lockfiles reach CI.
 */

import { execSync } from 'child_process'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

function findPackageDirs(dir, results = []) {
  const pkgPath = resolve(dir, 'package.json')
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    }
    const hasLivingArch = Object.keys(allDeps).some((d) =>
      d.startsWith('@living-architecture/')
    )
    if (hasLivingArch) {
      results.push(dir)
    }
  }

  if (dir !== rootDir) return results

  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry)
    if (
      entry.startsWith('.') ||
      entry === 'node_modules' ||
      entry === 'scripts' ||
      !statSync(full).isDirectory()
    ) {
      continue
    }
    findPackageDirs(full, results)
  }

  return results
}

const dirs = findPackageDirs(rootDir)

if (dirs.length === 0) {
  console.log('No packages with @living-architecture/* dependencies found.')
  process.exit(0)
}

console.log(`Updating @living-architecture/* in ${dirs.length} package(s)...`)

let anyUpdated = false

for (const dir of dirs) {
  const rel = dir.replace(rootDir + '/', '') || '.'
  try {
    execSync('pnpm update "@living-architecture/*"', {
      cwd: dir,
      stdio: 'pipe',
    })

    // Stage any changed lockfiles
    const lockfile = resolve(dir, 'pnpm-lock.yaml')
    if (existsSync(lockfile)) {
      const diff = execSync(`git diff --name-only "${lockfile}"`, {
        cwd: rootDir,
        encoding: 'utf-8',
      }).trim()
      if (diff) {
        execSync(`git add "${lockfile}"`, { cwd: rootDir })
        console.log(`  ${rel}: updated and staged lockfile`)
        anyUpdated = true
      } else {
        console.log(`  ${rel}: already up to date`)
      }
    }
  } catch (err) {
    console.error(`  ${rel}: update failed`)
    console.error(err.stderr?.toString() || err.message)
    process.exit(1)
  }
}

if (anyUpdated) {
  console.log('Lockfiles updated and staged.')
} else {
  console.log('All packages already at latest versions.')
}
