import { InventoryItem } from '../../../domain/InventoryItem'

export class ReleaseInventoryUseCase {
  apply(
    orderId: string,
    items: Array<{ sku: string; quantity: number }>,
    inventoryItems: Map<string, InventoryItem>
  ): void {
    for (const item of items) {
      const inventoryItem = inventoryItems.get(item.sku)

      if (!inventoryItem) {
        continue
      }

      inventoryItem.release(item.quantity)
    }

    console.log(`[Inventory] Released inventory for cancelled order ${orderId}`)
  }
}
