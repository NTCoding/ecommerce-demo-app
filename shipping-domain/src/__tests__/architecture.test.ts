import { describe, it, expect } from 'vitest'
import { Project } from 'ts-morph'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

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

describe('Architecture Enforcement: Use Cases', () => {
  it('DispatchShipmentUseCase has @riviere UseCase JSDoc tag', () => {
    const project = getProject()
    const filePath = resolve(srcDir, 'api/dispatch-shipment/use-cases/dispatch-shipment-use-case.ts')

    expect(hasRiviereUseCaseTag(project, filePath, 'DispatchShipmentUseCase')).toBe(true)
  })

  it('CreateShipmentUseCase has @riviere UseCase JSDoc tag', () => {
    const project = getProject()
    const filePath = resolve(srcDir, 'consumer/order-confirmed/use-cases/create-shipment-use-case.ts')

    expect(hasRiviereUseCaseTag(project, filePath, 'CreateShipmentUseCase')).toBe(true)
  })

  it('UpdateTrackingUseCase has @riviere UseCase JSDoc tag', () => {
    const project = getProject()
    const filePath = resolve(srcDir, 'jobs/update-tracking/use-cases/update-tracking-use-case.ts')

    expect(hasRiviereUseCaseTag(project, filePath, 'UpdateTrackingUseCase')).toBe(true)
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
