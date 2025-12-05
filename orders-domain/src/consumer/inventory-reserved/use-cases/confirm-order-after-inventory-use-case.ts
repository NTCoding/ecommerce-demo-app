import { Order } from '../../../domain/Order'

export class ConfirmOrderAfterInventoryUseCase {
  apply(orderId: string, order: Order): void {
    order.markInventoryReserved()
  }
}
