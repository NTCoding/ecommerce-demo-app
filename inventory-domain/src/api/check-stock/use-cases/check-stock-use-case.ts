import { StockUseCase } from '../../../decorators'
import { InventoryItem } from '../../../domain/InventoryItem'

export type StockInfo = {
  sku: string
  available: number
  reserved: number
  allocated: number
  state: string
}

@StockUseCase
export class CheckStockUseCase {
  apply(sku: string, inventoryItems: Map<string, InventoryItem>): StockInfo {
    const item = inventoryItems.get(sku)

    if (!item) {
      throw new Error(`SKU not found: ${sku}`)
    }

    return {
      sku: item.sku,
      available: item.availableQuantity,
      reserved: item.reservedQuantity,
      allocated: item.allocatedQuantity,
      state: item.getState()
    }
  }
}
