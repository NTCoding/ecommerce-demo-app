import { EventHandlerContainer } from '@living-architecture/riviere-extract-conventions'
import type { EventHandlerDef } from '@living-architecture/riviere-extract-conventions'
import { Order } from '../../domain/Order'
import type { PaymentCompleted } from '../../infrastructure/events'
import { ConfirmOrderAfterPaymentUseCase } from './use-cases/confirm-order-after-payment-use-case'

@EventHandlerContainer
export class PaymentCompletedHandler implements EventHandlerDef {
  readonly subscribedEvents = ['PaymentCompleted']
  constructor(private readonly useCase: ConfirmOrderAfterPaymentUseCase) {}

  handle(event: PaymentCompleted): void {
    console.log(`[Orders] Handling PaymentCompleted for order ${event.orderId}`)

    const order = new Order(event.orderId, 'customer123', [])

    this.useCase.apply(event.orderId, order)

    console.log(`[Orders] Order ${event.orderId} payment marked as completed`)
  }
}

export function handlePaymentCompleted(event: PaymentCompleted, useCase: ConfirmOrderAfterPaymentUseCase): void {
  const handler = new PaymentCompletedHandler(useCase)
  handler.handle(event)
}
