import { StockHandler } from '../../decorators'
import { InventoryItem } from '../../domain/InventoryItem'
import type { OrderPlaced } from '../../infrastructure/events'
import { ReserveInventoryUseCase } from './use-cases/reserve-inventory-use-case'

@StockHandler
export class OrderPlacedHandler {
  constructor(
    private readonly useCase: ReserveInventoryUseCase,
    private readonly inventoryItems: Map<string, InventoryItem>
  ) {}

  handle(event: OrderPlaced): void {
    console.log(`[Inventory] Handling OrderPlaced for order ${event.orderId}`)
    this.useCase.apply(event.orderId, event.items, this.inventoryItems)
    console.log(`[Inventory] Reserved inventory for order ${event.orderId}`)
  }
}
