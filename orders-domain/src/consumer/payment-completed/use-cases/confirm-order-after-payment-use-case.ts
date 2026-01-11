import { UseCase } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../../domain/Order'
import { publishEvent, type OrderConfirmed } from '../../../infrastructure/events'

@UseCase
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
