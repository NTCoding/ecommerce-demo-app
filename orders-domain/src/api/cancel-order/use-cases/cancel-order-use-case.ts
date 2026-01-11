import { UseCase } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../../domain/Order'
import { publishEvent, type OrderCancelled } from '../../../infrastructure/events'

export type CancelOrderRequest = {
  orderId: string
  reason: string
}

@UseCase
export class CancelOrderUseCase {
  apply(request: CancelOrderRequest, order: Order): void {
    order.cancel()

    const event: OrderCancelled = {
      type: 'OrderCancelled',
      orderId: request.orderId,
      reason: request.reason,
      timestamp: new Date().toISOString()
    }

    publishEvent(event)
  }
}
