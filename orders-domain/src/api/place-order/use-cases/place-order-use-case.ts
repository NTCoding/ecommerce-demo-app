import { UseCase } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../../domain/Order'
import { publishEvent, type OrderPlaced } from '../../../infrastructure/events'

export type PlaceOrderRequest = {
  customerId: string
  items: Array<{ sku: string; quantity: number }>
  totalAmount: number
}

@UseCase
export class PlaceOrderUseCase {
  apply(request: PlaceOrderRequest): Order {
    const orderId = `order_${Date.now()}`

    const order = new Order(orderId, request.customerId, request.items)

    order.begin()

    const event: OrderPlaced = {
      type: 'OrderPlaced',
      orderId,
      customerId: request.customerId,
      items: request.items,
      totalAmount: request.totalAmount,
      timestamp: new Date().toISOString()
    }

    publishEvent(event)

    return order
  }
}
