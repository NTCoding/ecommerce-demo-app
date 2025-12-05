import { Payment } from '../../domain/Payment'
import type { OrderCancelled } from '../../infrastructure/events'
import { RefundPaymentUseCase } from './use-cases/refund-payment-use-case'

export async function handleOrderCancelled(
  event: OrderCancelled,
  useCase: RefundPaymentUseCase
): Promise<void> {
  console.log(`[Payment] Handling OrderCancelled for order ${event.orderId}`)

  const payment = new Payment(`pay_${event.orderId}`, event.orderId, 100)

  await useCase.apply(event.orderId, payment)

  console.log(`[Payment] Refund processed for order ${event.orderId}`)
}
