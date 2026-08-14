import { UseCase } from '@living-architecture/riviere-extract-conventions-published-language'
import { Order } from '../../../domain/Order'

@UseCase
export class ShipOrderUseCase {
  apply(orderId: string, order: Order): void {
    order.ship()
  }
}
