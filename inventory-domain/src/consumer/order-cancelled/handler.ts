import type { EventHandlerDef } from '@living-architecture/riviere-extract-conventions'
import { StockHandler } from '../../decorators'
import { InventoryItem } from '../../domain/InventoryItem'
import type { OrderCancelled } from '../../infrastructure/events'
import { ReleaseInventoryUseCase } from './use-cases/release-inventory-use-case'

@StockHandler
export class OrderCancelledHandler implements EventHandlerDef {
  readonly subscribedEvents = ['OrderCancelled']
  constructor(
    private readonly useCase: ReleaseInventoryUseCase,
    private readonly inventoryItems: Map<string, InventoryItem>
  ) {}

  handle(event: OrderCancelled): void {
    console.log(`[Inventory] Handling OrderCancelled for order ${event.orderId}`)
    this.useCase.apply(event.orderId, [], this.inventoryItems)
  }
}

export function handleOrderCancelled(event: OrderCancelled, useCase: ReleaseInventoryUseCase, inventoryItems: Map<string, InventoryItem>): void {
  const handler = new OrderCancelledHandler(useCase, inventoryItems)
  handler.handle(event)
}
