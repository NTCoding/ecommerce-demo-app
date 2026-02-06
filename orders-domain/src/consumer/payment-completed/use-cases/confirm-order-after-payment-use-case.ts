import { UseCase } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../../domain/Order'
import { OrderConfirmed } from '../../../infrastructure/events'
import { OrderEventPublisher } from '../../../infrastructure/order-event-publisher'

@UseCase
export class ConfirmOrderAfterPaymentUseCase {
  constructor(private readonly publisher: OrderEventPublisher) {}

  apply(orderId: string, order: Order): void {
    order.markPaymentCompleted()

    if (order.getState() === 'Confirmed') {
      this.publisher.publishOrderConfirmed(
        new OrderConfirmed(orderId)
      )
    }
  }
}
