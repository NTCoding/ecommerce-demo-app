import { EventHandlerContainer } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../domain/Order'
import type { InventoryReserved } from '../../infrastructure/events'
import { ConfirmOrderAfterInventoryUseCase } from './use-cases/confirm-order-after-inventory-use-case'

@EventHandlerContainer
export class InventoryReservedHandler {
  constructor(private readonly useCase: ConfirmOrderAfterInventoryUseCase) {}

  handle(event: InventoryReserved): void {
    console.log(`[Orders] Handling InventoryReserved for order ${event.orderId}`)

    const order = new Order(event.orderId, 'customer123', event.items)

    this.useCase.apply(event.orderId, order)

    console.log(`[Orders] Order ${event.orderId} inventory marked as reserved`)
  }
}
