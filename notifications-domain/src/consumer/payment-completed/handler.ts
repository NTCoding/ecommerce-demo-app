import type { PaymentCompleted } from '../../infrastructure/events'
import { NotifyPaymentCompletedUseCase } from './use-cases/notify-payment-completed-use-case'

export function handlePaymentCompleted(
  event: PaymentCompleted,
  useCase: NotifyPaymentCompletedUseCase
): void {
  console.log(
    `[Notifications] Handling PaymentCompleted for order ${event.orderId}`
  )

  useCase.apply(event.orderId, event.paymentId, event.amount)
}
