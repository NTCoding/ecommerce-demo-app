import { Order } from '../../../domain/Order'

export class ShipOrderUseCase {
  apply(orderId: string, order: Order): void {
    order.ship()
  }
}
