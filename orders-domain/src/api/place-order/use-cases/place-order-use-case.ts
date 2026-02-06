import { UseCase } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../../domain/Order'
import { OrderPlaced } from '../../../infrastructure/events'
import { OrderEventPublisher } from '../../../infrastructure/order-event-publisher'

export type PlaceOrderRequest = {
  customerId: string
  items: Array<{ sku: string; quantity: number; price: number }>
  totalAmount: number
}

@UseCase
export class PlaceOrderUseCase {
  constructor(private readonly publisher: OrderEventPublisher) {}

  apply(request: PlaceOrderRequest): Order {
    const orderId = `order_${Date.now()}`

    const order = new Order(orderId, request.customerId, request.items)

    order.begin()

    this.publisher.publishOrderPlaced(
      new OrderPlaced(
        orderId,
        request.customerId,
        request.items,
        request.totalAmount
      )
    )

    return order
  }
}
