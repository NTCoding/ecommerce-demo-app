import type { OrderPlaced } from '../../infrastructure/events'
import { NotifyOrderPlacedUseCase } from './use-cases/notify-order-placed-use-case'

export function handleOrderPlaced(
  event: OrderPlaced,
  useCase: NotifyOrderPlacedUseCase
): void {
  console.log(
    `[Notifications] Handling OrderPlaced for order ${event.orderId}`
  )

  useCase.apply(event.orderId, event.customerId)
}
