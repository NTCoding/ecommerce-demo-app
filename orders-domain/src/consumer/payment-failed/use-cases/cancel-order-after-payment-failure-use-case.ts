import { UseCase } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../../domain/Order'
import { OrderCancelled } from '../../../infrastructure/events'
import { OrderEventPublisher } from '../../../infrastructure/order-event-publisher'

@UseCase
export class CancelOrderAfterPaymentFailureUseCase {
  constructor(private readonly publisher: OrderEventPublisher) {}

  apply(orderId: string, reason: string, order: Order): void {
    order.cancel()

    this.publisher.publishOrderCancelled(
      new OrderCancelled(orderId, `Payment failed: ${reason}`)
    )
  }
}
