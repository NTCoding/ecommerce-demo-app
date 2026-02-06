import { StockUseCase } from '../../../decorators'
import { InventoryItem } from '../../../domain/InventoryItem'
import { InventoryReserved } from '../../../infrastructure/events'
import { InventoryEventPublisher } from '../../../infrastructure/inventory-event-publisher'

@StockUseCase
export class ReserveInventoryUseCase {
  constructor(private readonly publisher: InventoryEventPublisher) {}

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

    this.publisher.publishInventoryReserved(
      new InventoryReserved(orderId, items)
    )
  }
}
