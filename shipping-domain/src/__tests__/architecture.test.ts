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

function hasRiviereUseCaseTag(project: Project, filePath: string, className: string): boolean {
  const sourceFile = project.addSourceFileAtPath(filePath)
  const classDecl = sourceFile.getClassOrThrow(className)
  const jsDocs = classDecl.getJsDocs()

  return jsDocs.some((doc) =>
    doc.getTags().some((tag) =>
      tag.getTagName() === 'riviere' && tag.getCommentText() === 'UseCase'
    )
  )
}

describe('shipping-domain', () => {
  describe('Use Cases must have @riviere UseCase JSDoc tag', () => {
    // Known components - ensures they exist and are properly annotated
    it('DispatchShipmentUseCase', () => {
      expect(hasRiviereUseCaseTag(getProject(), resolve(srcDir, 'api/dispatch-shipment/use-cases/dispatch-shipment-use-case.ts'), 'DispatchShipmentUseCase')).toBe(true)
    })

    it('CreateShipmentUseCase', () => {
      expect(hasRiviereUseCaseTag(getProject(), resolve(srcDir, 'consumer/order-confirmed/use-cases/create-shipment-use-case.ts'), 'CreateShipmentUseCase')).toBe(true)
    })

    it('UpdateTrackingUseCase', () => {
      expect(hasRiviereUseCaseTag(getProject(), resolve(srcDir, 'jobs/update-tracking/use-cases/update-tracking-use-case.ts'), 'UpdateTrackingUseCase')).toBe(true)
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
          const jsDocs = classDecl.getJsDocs()
          const hasTag = jsDocs.some((doc) =>
            doc.getTags().some((tag) =>
              tag.getTagName() === 'riviere' && tag.getCommentText() === 'UseCase'
            )
          )

          if (!hasTag) {
            violations.push(`${classDecl.getName()} missing @riviere UseCase`)
          }
        }
      }

      expect(violations).toEqual([])
    })
  })
})
