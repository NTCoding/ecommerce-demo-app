import { InventoryItem } from '../../domain/InventoryItem'
import type { OrderCancelled } from '../../infrastructure/events'
import { ReleaseInventoryUseCase } from './use-cases/release-inventory-use-case'

export function handleOrderCancelled(
  event: OrderCancelled,
  useCase: ReleaseInventoryUseCase,
  inventoryItems: Map<string, InventoryItem>
): void {
  console.log(`[Inventory] Handling OrderCancelled for order ${event.orderId}`)

  useCase.apply(event.orderId, [], inventoryItems)
}
