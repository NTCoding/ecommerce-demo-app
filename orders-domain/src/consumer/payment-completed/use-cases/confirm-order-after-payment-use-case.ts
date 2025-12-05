import { Order } from '../../../domain/Order'
import { publishEvent, type OrderConfirmed } from '../../../infrastructure/events'

export class ConfirmOrderAfterPaymentUseCase {
  apply(orderId: string, order: Order): void {
    order.markPaymentCompleted()

    if (order.getState() === 'Confirmed') {
      const event: OrderConfirmed = {
        type: 'OrderConfirmed',
        orderId,
        timestamp: new Date().toISOString()
      }

      publishEvent(event)
    }
  }
}
