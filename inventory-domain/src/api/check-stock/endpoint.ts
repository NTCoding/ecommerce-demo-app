import type { Request, Response } from 'express'
import { InventoryItem } from '../../domain/InventoryItem'
import { CheckStockUseCase } from './use-cases/check-stock-use-case'

export function checkStockEndpoint(
  useCase: CheckStockUseCase,
  inventoryItems: Map<string, InventoryItem>
) {
  return (req: Request, res: Response): void => {
    const sku = req.params['sku']

    if (!sku) {
      res.status(400).json({ error: 'SKU is required' })
      return
    }

    try {
      const stockInfo = useCase.apply(sku, inventoryItems)
      res.status(200).json(stockInfo)
    } catch (error) {
      res.status(404).json({
        error: error instanceof Error ? error.message : 'SKU not found'
      })
    }
  }
}
