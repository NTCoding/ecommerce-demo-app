import { Order } from '../../domain/Order'
import type { ShipmentDispatched } from '../../infrastructure/events'
import { ShipOrderUseCase } from './use-cases/ship-order-use-case'

export function handleShipmentDispatched(
  event: ShipmentDispatched,
  useCase: ShipOrderUseCase
): void {
  console.log(`[Orders] Handling ShipmentDispatched for order ${event.orderId}`)

  const order = new Order(event.orderId, 'customer123', [])

  useCase.apply(event.orderId, order)

  console.log(`[Orders] Order ${event.orderId} marked as shipped`)
}
