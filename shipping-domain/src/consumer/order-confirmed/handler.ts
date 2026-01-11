import type { OrderConfirmed } from '../../infrastructure/events'
import { CreateShipmentUseCase } from './use-cases/create-shipment-use-case'

/** @riviere EventHandler */
export function handleOrderConfirmed(
  event: OrderConfirmed,
  useCase: CreateShipmentUseCase
): void {
  console.log(`[Shipping] Handling OrderConfirmed for order ${event.orderId}`)

  useCase.apply(event.orderId, '123 Main St, City, Country')

  console.log(`[Shipping] Creating shipment for order ${event.orderId}`)
}
