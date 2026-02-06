import { UseCase } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../../domain/Order'
import { OrderCancelled } from '../../../infrastructure/events'
import { OrderEventPublisher } from '../../../infrastructure/order-event-publisher'

export type CancelOrderRequest = {
  orderId: string
  reason: string
}

@UseCase
export class CancelOrderUseCase {
  constructor(private readonly publisher: OrderEventPublisher) {}

  apply(request: CancelOrderRequest, order: Order): void {
    order.cancel()

    this.publisher.publishOrderCancelled(
      new OrderCancelled(request.orderId, request.reason)
    )
  }
}
