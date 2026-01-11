import { describe, it, expect } from 'vitest'
import { Project } from 'ts-morph'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { globSync } from 'glob'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(__dirname, '..')

describe('Architecture Enforcement', () => {
  it('all use case classes follow naming convention (ends with UseCase)', () => {
    const project = new Project({ tsConfigFilePath: resolve(srcDir, '..', 'tsconfig.json') })

    const useCaseFiles = globSync('**/use-cases/*-use-case.ts', { cwd: srcDir, absolute: true })
    expect(useCaseFiles.length).toBeGreaterThan(0)

    useCaseFiles.forEach((f) => project.addSourceFileAtPath(f))

    const violations: string[] = []

    for (const filePath of useCaseFiles) {
      const sourceFile = project.getSourceFileOrThrow(filePath)
      const classes = sourceFile.getClasses()

      for (const classDecl of classes) {
        const className = classDecl.getName()
        if (!className?.endsWith('UseCase')) {
          violations.push(`${filePath}: ${className} does not end with 'UseCase'`)
        }
      }
    }

    expect(violations).toEqual([])
  })

  it('expected use cases are present', () => {
    const useCaseFiles = globSync('**/use-cases/*-use-case.ts', { cwd: srcDir, absolute: true })
    const useCaseNames = useCaseFiles.map((f) => f.split('/').pop()?.replace('.ts', ''))

    expect(useCaseNames).toContain('process-payment-use-case')
    expect(useCaseNames).toContain('refund-payment-use-case')
  })
})
