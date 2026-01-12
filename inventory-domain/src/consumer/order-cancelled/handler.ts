import { StockHandler } from '../../decorators'
import { InventoryItem } from '../../domain/InventoryItem'
import type { OrderCancelled } from '../../infrastructure/events'
import { ReleaseInventoryUseCase } from './use-cases/release-inventory-use-case'

@StockHandler
export class OrderCancelledHandler {
  constructor(
    private readonly useCase: ReleaseInventoryUseCase,
    private readonly inventoryItems: Map<string, InventoryItem>
  ) {}

  handle(event: OrderCancelled): void {
    console.log(`[Inventory] Handling OrderCancelled for order ${event.orderId}`)
    this.useCase.apply(event.orderId, [], this.inventoryItems)
  }
}
