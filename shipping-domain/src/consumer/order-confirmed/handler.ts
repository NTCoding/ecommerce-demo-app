import type { OrderConfirmed } from '../../infrastructure/events'
import { CreateShipmentUseCase } from './use-cases/create-shipment-use-case'

/** @eventHandler */
export class OrderConfirmedHandler {
  readonly subscribedEvents = ['OrderConfirmed']
  constructor(private readonly useCase: CreateShipmentUseCase) {}

  handle(event: OrderConfirmed): void {
    console.log(`[Shipping] Handling OrderConfirmed for order ${event.orderId}`)

    this.useCase.apply(event.orderId, '123 Main St, City, Country')

    console.log(`[Shipping] Creating shipment for order ${event.orderId}`)
  }
}

export function handleOrderConfirmed(
  event: OrderConfirmed,
  useCase: CreateShipmentUseCase
): void {
  const handler = new OrderConfirmedHandler(useCase)
  handler.handle(event)
}
