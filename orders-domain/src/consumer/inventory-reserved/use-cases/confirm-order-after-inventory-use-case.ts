import { UseCase } from '@living-architecture/riviere-extract-conventions-published-language'
import { Order } from '../../../domain/Order'

@UseCase
export class ConfirmOrderAfterInventoryUseCase {
  apply(orderId: string, order: Order): void {
    order.markInventoryReserved()
  }
}
