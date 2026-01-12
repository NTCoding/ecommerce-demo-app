import { BaseNotificationHandler } from '../../base-classes'
import type { OrderPlaced } from '../../infrastructure/events'
import { NotifyOrderPlacedUseCase } from './use-cases/notify-order-placed-use-case'

export class OrderPlacedHandler extends BaseNotificationHandler<OrderPlaced> {
  constructor(private readonly useCase: NotifyOrderPlacedUseCase) {
    super()
  }

  handle(event: OrderPlaced): void {
    console.log(`[Notifications] Handling OrderPlaced for order ${event.orderId}`)
    this.useCase.apply(event.orderId, event.customerId)
  }
}
