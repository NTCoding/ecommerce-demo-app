import { describe, it, expect } from 'vitest'
import { Project } from 'ts-morph'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { globSync } from 'glob'

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

describe('inventory-domain', () => {
  describe('Use Cases must have @StockUseCase decorator', () => {
    // Known components - ensures they exist and are properly annotated
    it('CheckStockUseCase', () => {
      expect(hasStockUseCaseDecorator(getProject(), resolve(srcDir, 'api/check-stock/use-cases/check-stock-use-case.ts'), 'CheckStockUseCase')).toBe(true)
    })

    it('ReserveInventoryUseCase', () => {
      expect(hasStockUseCaseDecorator(getProject(), resolve(srcDir, 'consumer/order-placed/use-cases/reserve-inventory-use-case.ts'), 'ReserveInventoryUseCase')).toBe(true)
    })

    it('ReleaseInventoryUseCase', () => {
      expect(hasStockUseCaseDecorator(getProject(), resolve(srcDir, 'consumer/order-cancelled/use-cases/release-inventory-use-case.ts'), 'ReleaseInventoryUseCase')).toBe(true)
    })

    it('AllocateInventoryUseCase', () => {
      expect(hasStockUseCaseDecorator(getProject(), resolve(srcDir, 'consumer/shipment-created/use-cases/allocate-inventory-use-case.ts'), 'AllocateInventoryUseCase')).toBe(true)
    })

    // Catch-all - fails if ANY new use case is added without annotation
    it('no unannotated use cases', () => {
      const project = getProject()
      const useCaseFiles = globSync('**/use-cases/**/*.ts', {
        cwd: srcDir,
        absolute: true,
        ignore: ['**/__tests__/**']
      })

      useCaseFiles.forEach((f) => project.addSourceFileAtPath(f))

      const violations: string[] = []

      for (const filePath of useCaseFiles) {
        const sourceFile = project.getSourceFileOrThrow(filePath)

        for (const classDecl of sourceFile.getClasses()) {
          const hasDecorator = classDecl.getDecorators().some((d) => d.getName() === 'StockUseCase')

          if (!hasDecorator) {
            violations.push(`${classDecl.getName()} missing @StockUseCase`)
          }
        }
      }

      expect(violations).toEqual([])
    })
  })
})
