import { Order } from '../../domain/Order'
import type { ShipmentDelivered } from '../../infrastructure/events'
import { CompleteOrderUseCase } from './use-cases/complete-order-use-case'

export function handleShipmentDelivered(
  event: ShipmentDelivered,
  useCase: CompleteOrderUseCase
): void {
  console.log(`[Orders] Handling ShipmentDelivered for order ${event.orderId}`)

  const order = new Order(event.orderId, 'customer123', [])

  useCase.apply(event.orderId, order)

  console.log(`[Orders] Order ${event.orderId} marked as delivered`)
}
