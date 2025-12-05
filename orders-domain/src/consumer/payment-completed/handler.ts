import { Order } from '../../domain/Order'
import type { PaymentCompleted } from '../../infrastructure/events'
import { ConfirmOrderAfterPaymentUseCase } from './use-cases/confirm-order-after-payment-use-case'

export function handlePaymentCompleted(
  event: PaymentCompleted,
  useCase: ConfirmOrderAfterPaymentUseCase
): void {
  console.log(`[Orders] Handling PaymentCompleted for order ${event.orderId}`)

  const order = new Order(event.orderId, 'customer123', [])

  useCase.apply(event.orderId, order)

  console.log(`[Orders] Order ${event.orderId} payment marked as completed`)
}
