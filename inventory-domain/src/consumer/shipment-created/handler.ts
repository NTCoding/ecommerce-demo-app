import { StockHandler } from '../../decorators'
import { InventoryItem } from '../../domain/InventoryItem'
import type { ShipmentCreated } from '../../infrastructure/events'
import { AllocateInventoryUseCase } from './use-cases/allocate-inventory-use-case'

@StockHandler
export class ShipmentCreatedHandler {
  constructor(
    private readonly useCase: AllocateInventoryUseCase,
    private readonly inventoryItems: Map<string, InventoryItem>
  ) {}

  handle(event: ShipmentCreated): void {
    console.log(`[Inventory] Handling ShipmentCreated for order ${event.orderId}`)
    const items = [{ sku: 'SKU-001', quantity: 1 }]
    this.useCase.apply(event.orderId, items, this.inventoryItems)
    console.log(`[Inventory] Inventory allocated for shipment ${event.shipmentId}`)
  }
}
