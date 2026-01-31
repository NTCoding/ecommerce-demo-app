import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('orders extraction config', () => {
  it('uses only default convention inheritance with no overrides', () => {
    const configPath = resolve(__dirname, '../../../.riviere/config/orders.extraction.json')
    const config = JSON.parse(readFileSync(configPath, 'utf-8'))
    expect(Object.keys(config)).toStrictEqual(['name', 'path', 'extends'])
  })
})
