import { InventoryItem } from '../../domain/InventoryItem'
import type { ShipmentCreated } from '../../infrastructure/events'
import { AllocateInventoryUseCase } from './use-cases/allocate-inventory-use-case'

export function handleShipmentCreated(
  event: ShipmentCreated,
  useCase: AllocateInventoryUseCase,
  inventoryItems: Map<string, InventoryItem>
): void {
  console.log(`[Inventory] Handling ShipmentCreated for order ${event.orderId}`)

  const items = [{ sku: 'SKU-001', quantity: 1 }]

  useCase.apply(event.orderId, items, inventoryItems)

  console.log(`[Inventory] Inventory allocated for shipment ${event.shipmentId}`)
}
