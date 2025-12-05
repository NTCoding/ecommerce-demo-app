import type { OrderPlaced } from '../../infrastructure/events'
import { ProcessPaymentUseCase } from './use-cases/process-payment-use-case'

export function handleOrderPlaced(
  event: OrderPlaced,
  useCase: ProcessPaymentUseCase
): void {
  console.log(`[Payment] Handling OrderPlaced for order ${event.orderId}`)

  useCase.apply(event.orderId, event.totalAmount)

  console.log(`[Payment] Processing payment for order ${event.orderId}`)
}
