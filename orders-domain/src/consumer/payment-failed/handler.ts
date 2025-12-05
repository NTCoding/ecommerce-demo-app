import { Order } from '../../domain/Order'
import type { PaymentFailed } from '../../infrastructure/events'
import { CancelOrderAfterPaymentFailureUseCase } from './use-cases/cancel-order-after-payment-failure-use-case'

export function handlePaymentFailed(
  event: PaymentFailed,
  useCase: CancelOrderAfterPaymentFailureUseCase
): void {
  console.log(`[Orders] Handling PaymentFailed for order ${event.orderId}`)

  const order = new Order(event.orderId, 'customer123', [])

  useCase.apply(event.orderId, event.reason, order)

  console.log(`[Orders] Order ${event.orderId} cancelled due to payment failure`)
}
