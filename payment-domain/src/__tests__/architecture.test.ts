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

function classEndsWithUseCase(project: Project, filePath: string, className: string): boolean {
  const sourceFile = project.addSourceFileAtPath(filePath)
  const classDecl = sourceFile.getClassOrThrow(className)

  return classDecl.getName()?.endsWith('UseCase') ?? false
}

describe('payment-domain', () => {
  describe('Use Cases must end with UseCase suffix', () => {
    // Known components - ensures they exist and follow naming convention
    it('ProcessPaymentUseCase', () => {
      expect(classEndsWithUseCase(getProject(), resolve(srcDir, 'consumer/order-placed/use-cases/process-payment-use-case.ts'), 'ProcessPaymentUseCase')).toBe(true)
    })

    it('RefundPaymentUseCase', () => {
      expect(classEndsWithUseCase(getProject(), resolve(srcDir, 'consumer/order-cancelled/use-cases/refund-payment-use-case.ts'), 'RefundPaymentUseCase')).toBe(true)
    })

    // Catch-all - fails if ANY new use case violates naming convention
    it('no naming convention violations', () => {
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
          const className = classDecl.getName()
          if (!className?.endsWith('UseCase')) {
            violations.push(`${className} must end with UseCase`)
          }
        }
      }

      expect(violations).toEqual([])
    })
  })
})
