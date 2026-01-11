import { UseCase } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../../domain/Order'

@UseCase
export class CompleteOrderUseCase {
  apply(orderId: string, order: Order): void {
    order.deliver()
  }
}
