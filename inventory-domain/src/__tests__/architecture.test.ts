import { describe, it, expect } from 'vitest'
import { Project } from 'ts-morph'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(__dirname, '..')

function getProject(): Project {
  return new Project({ tsConfigFilePath: resolve(srcDir, '..', 'tsconfig.json') })
}

function hasStockUseCaseDecorator(project: Project, filePath: string, className: string): boolean {
  const sourceFile = project.addSourceFileAtPath(filePath)
  const classDecl = sourceFile.getClassOrThrow(className)

  return classDecl.getDecorators().some((d) => d.getName() === 'StockUseCase')
}

describe('Architecture Enforcement: Use Cases', () => {
  it('CheckStockUseCase has @StockUseCase decorator', () => {
    const project = getProject()
    const filePath = resolve(srcDir, 'api/check-stock/use-cases/check-stock-use-case.ts')

    expect(hasStockUseCaseDecorator(project, filePath, 'CheckStockUseCase')).toBe(true)
  })

  it('ReserveInventoryUseCase has @StockUseCase decorator', () => {
    const project = getProject()
    const filePath = resolve(srcDir, 'consumer/order-placed/use-cases/reserve-inventory-use-case.ts')

    expect(hasStockUseCaseDecorator(project, filePath, 'ReserveInventoryUseCase')).toBe(true)
  })

  it('ReleaseInventoryUseCase has @StockUseCase decorator', () => {
    const project = getProject()
    const filePath = resolve(srcDir, 'consumer/order-cancelled/use-cases/release-inventory-use-case.ts')

    expect(hasStockUseCaseDecorator(project, filePath, 'ReleaseInventoryUseCase')).toBe(true)
  })

  it('AllocateInventoryUseCase has @StockUseCase decorator', () => {
    const project = getProject()
    const filePath = resolve(srcDir, 'consumer/shipment-created/use-cases/allocate-inventory-use-case.ts')

    expect(hasStockUseCaseDecorator(project, filePath, 'AllocateInventoryUseCase')).toBe(true)
  })
})

describe('Architecture Enforcement: Completeness', () => {
  it('no unannotated use case classes exist', () => {
    const project = getProject()
    const glob = require('glob')

    const useCaseFiles = glob.globSync('**/use-cases/*-use-case.ts', {
      cwd: srcDir,
      absolute: true,
      ignore: ['**/__tests__/**']
    })

    useCaseFiles.forEach((f: string) => project.addSourceFileAtPath(f))

    const violations: string[] = []

    for (const filePath of useCaseFiles) {
      const sourceFile = project.getSourceFileOrThrow(filePath)

      for (const classDecl of sourceFile.getClasses()) {
        const hasDecorator = classDecl.getDecorators().some((d) => d.getName() === 'StockUseCase')

        if (!hasDecorator) {
          violations.push(`${classDecl.getName()} missing @StockUseCase decorator`)
        }
      }
    }

    expect(violations).toEqual([])
  })
})
