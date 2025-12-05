import { Order } from '../../../domain/Order'
import { publishEvent, type OrderCancelled } from '../../../infrastructure/events'

export class CancelOrderAfterPaymentFailureUseCase {
  apply(orderId: string, reason: string, order: Order): void {
    order.cancel()

    const event: OrderCancelled = {
      type: 'OrderCancelled',
      orderId,
      reason: `Payment failed: ${reason}`,
      timestamp: new Date().toISOString()
    }

    publishEvent(event)
  }
}
