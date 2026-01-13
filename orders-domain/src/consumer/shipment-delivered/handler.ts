import { EventHandlerContainer } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../domain/Order'
import type { ShipmentDelivered } from '../../infrastructure/events'
import { CompleteOrderUseCase } from './use-cases/complete-order-use-case'

@EventHandlerContainer
export class ShipmentDeliveredHandler {
  constructor(private readonly useCase: CompleteOrderUseCase) {}

  handle(event: ShipmentDelivered): void {
    console.log(`[Orders] Handling ShipmentDelivered for order ${event.orderId}`)

    const order = new Order(event.orderId, 'customer123', [])

    this.useCase.apply(event.orderId, order)

    console.log(`[Orders] Order ${event.orderId} marked as delivered`)
  }
}

export function handleShipmentDelivered(event: ShipmentDelivered, useCase: CompleteOrderUseCase): void {
  const handler = new ShipmentDeliveredHandler(useCase)
  handler.handle(event)
}
