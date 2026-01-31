import type { Request, Response } from 'express'
import { StockAPI } from '../../decorators'
import { InventoryItem } from '../../domain/InventoryItem'
import { CheckStockUseCase } from './use-cases/check-stock-use-case'

@StockAPI
export class CheckStockEndpoint {
  readonly route = '/inventory/:sku'
  readonly method = 'GET'
  constructor(
    private readonly useCase: CheckStockUseCase,
    private readonly inventoryItems: Map<string, InventoryItem>
  ) {}

  handle(req: Request, res: Response): void {
    const sku = req.params['sku']

    if (!sku) {
      res.status(400).json({ error: 'SKU is required' })
      return
    }

    try {
      const stockInfo = this.useCase.apply(sku, this.inventoryItems)
      res.status(200).json(stockInfo)
    } catch (error) {
      res.status(404).json({
        error: error instanceof Error ? error.message : 'SKU not found'
      })
    }
  }
}

export function checkStockEndpoint(useCase: CheckStockUseCase, inventoryItems: Map<string, InventoryItem>) {
  const endpoint = new CheckStockEndpoint(useCase, inventoryItems)
  return (req: Request, res: Response) => endpoint.handle(req, res)
}
