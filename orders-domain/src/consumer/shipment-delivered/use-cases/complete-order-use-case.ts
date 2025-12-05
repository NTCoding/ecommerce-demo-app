import { Order } from '../../../domain/Order'

export class CompleteOrderUseCase {
  apply(orderId: string, order: Order): void {
    order.deliver()
  }
}
