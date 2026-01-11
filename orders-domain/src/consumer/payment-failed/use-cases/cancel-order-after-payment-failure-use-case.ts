import { UseCase } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../../domain/Order'
import { publishEvent, type OrderCancelled } from '../../../infrastructure/events'

@UseCase
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
