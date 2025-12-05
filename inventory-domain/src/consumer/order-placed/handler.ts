import { InventoryItem } from '../../domain/InventoryItem'
import type { OrderPlaced } from '../../infrastructure/events'
import { ReserveInventoryUseCase } from './use-cases/reserve-inventory-use-case'

export function handleOrderPlaced(
  event: OrderPlaced,
  useCase: ReserveInventoryUseCase,
  inventoryItems: Map<string, InventoryItem>
): void {
  console.log(`[Inventory] Handling OrderPlaced for order ${event.orderId}`)

  useCase.apply(event.orderId, event.items, inventoryItems)

  console.log(`[Inventory] Reserved inventory for order ${event.orderId}`)
}
