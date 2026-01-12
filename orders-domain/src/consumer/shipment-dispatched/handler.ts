import { EventHandlerContainer } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../domain/Order'
import type { ShipmentDispatched } from '../../infrastructure/events'
import { ShipOrderUseCase } from './use-cases/ship-order-use-case'

@EventHandlerContainer
export class ShipmentDispatchedHandler {
  constructor(private readonly useCase: ShipOrderUseCase) {}

  handle(event: ShipmentDispatched): void {
    console.log(`[Orders] Handling ShipmentDispatched for order ${event.orderId}`)

    const order = new Order(event.orderId, 'customer123', [])

    this.useCase.apply(event.orderId, order)

    console.log(`[Orders] Order ${event.orderId} marked as shipped`)
  }
}
