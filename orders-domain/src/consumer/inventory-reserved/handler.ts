import { Order } from '../../domain/Order'
import type { InventoryReserved } from '../../infrastructure/events'
import { ConfirmOrderAfterInventoryUseCase } from './use-cases/confirm-order-after-inventory-use-case'

/** @riviere EventHandler */
export function handleInventoryReserved(
  event: InventoryReserved,
  useCase: ConfirmOrderAfterInventoryUseCase
): void {
  console.log(`[Orders] Handling InventoryReserved for order ${event.orderId}`)

  const order = new Order(event.orderId, 'customer123', event.items)

  useCase.apply(event.orderId, order)

  console.log(`[Orders] Order ${event.orderId} inventory marked as reserved`)
}
