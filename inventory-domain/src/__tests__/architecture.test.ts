import { describe, it, expect } from 'vitest'
import { Project } from 'ts-morph'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { globSync } from 'glob'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(__dirname, '..')

describe('Architecture Enforcement', () => {
  it('all use case classes have @StockUseCase decorator', () => {
    const project = new Project({ tsConfigFilePath: resolve(srcDir, '..', 'tsconfig.json') })

    const useCaseFiles = globSync('**/use-cases/*-use-case.ts', { cwd: srcDir, absolute: true })
    expect(useCaseFiles.length).toBeGreaterThan(0)

    useCaseFiles.forEach((f) => project.addSourceFileAtPath(f))

    const violations: string[] = []

    for (const filePath of useCaseFiles) {
      const sourceFile = project.getSourceFileOrThrow(filePath)
      const classes = sourceFile.getClasses()

      for (const classDecl of classes) {
        const hasStockUseCase = classDecl.getDecorators().some((d) => d.getName() === 'StockUseCase')

        if (!hasStockUseCase) {
          violations.push(`${filePath}: ${classDecl.getName()} missing @StockUseCase decorator`)
        }
      }
    }

    expect(violations).toEqual([])
  })

  it('expected use cases are present', () => {
    const useCaseFiles = globSync('**/use-cases/*-use-case.ts', { cwd: srcDir, absolute: true })
    const useCaseNames = useCaseFiles.map((f) => f.split('/').pop()?.replace('.ts', ''))

    expect(useCaseNames).toContain('check-stock-use-case')
    expect(useCaseNames).toContain('reserve-inventory-use-case')
    expect(useCaseNames).toContain('release-inventory-use-case')
    expect(useCaseNames).toContain('allocate-inventory-use-case')
  })
})
