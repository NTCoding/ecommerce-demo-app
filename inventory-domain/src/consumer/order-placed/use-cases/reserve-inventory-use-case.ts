import { InventoryItem } from '../../../domain/InventoryItem'
import { publishEvent, type InventoryReserved } from '../../../infrastructure/events'

export class ReserveInventoryUseCase {
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

      inventoryItem.reserve(item.quantity)
    }

    const event: InventoryReserved = {
      type: 'InventoryReserved',
      orderId,
      items,
      timestamp: new Date().toISOString()
    }

    publishEvent(event)
  }
}
