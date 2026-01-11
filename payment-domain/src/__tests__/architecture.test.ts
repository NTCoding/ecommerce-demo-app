import { describe, it, expect } from 'vitest'
import { Project } from 'ts-morph'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(__dirname, '..')

function getProject(): Project {
  return new Project({ tsConfigFilePath: resolve(srcDir, '..', 'tsconfig.json') })
}

function classNameEndsWithUseCase(project: Project, filePath: string, className: string): boolean {
  const sourceFile = project.addSourceFileAtPath(filePath)
  const classDecl = sourceFile.getClassOrThrow(className)

  return classDecl.getName()?.endsWith('UseCase') ?? false
}

describe('Architecture Enforcement: Use Cases', () => {
  it('ProcessPaymentUseCase follows naming convention', () => {
    const project = getProject()
    const filePath = resolve(srcDir, 'consumer/order-placed/use-cases/process-payment-use-case.ts')

    expect(classNameEndsWithUseCase(project, filePath, 'ProcessPaymentUseCase')).toBe(true)
  })

  it('RefundPaymentUseCase follows naming convention', () => {
    const project = getProject()
    const filePath = resolve(srcDir, 'consumer/order-cancelled/use-cases/refund-payment-use-case.ts')

    expect(classNameEndsWithUseCase(project, filePath, 'RefundPaymentUseCase')).toBe(true)
  })
})

describe('Architecture Enforcement: Completeness', () => {
  it('no use case class violates naming convention', () => {
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
        const className = classDecl.getName()
        if (!className?.endsWith('UseCase')) {
          violations.push(`${className} does not end with 'UseCase'`)
        }
      }
    }

    expect(violations).toEqual([])
  })
})
