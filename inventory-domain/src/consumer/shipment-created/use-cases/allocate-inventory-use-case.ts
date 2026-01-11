import { StockUseCase } from '../../../decorators'
import { InventoryItem } from '../../../domain/InventoryItem'

@StockUseCase
export class AllocateInventoryUseCase {
  apply(
    orderId: string,
    items: Array<{ sku: string; quantity: number }>,
    inventoryItems: Map<string, InventoryItem>
  ): void {
    for (const item of items) {
      const inventoryItem = inventoryItems.get(item.sku)

      if (!inventoryItem) {
        throw new Error(`Inventory item not found for SKU: ${item.sku}`)
      }

      inventoryItem.allocate(item.quantity)
    }

    console.log(`[Inventory] Allocated inventory for order ${orderId}`)
  }
}
