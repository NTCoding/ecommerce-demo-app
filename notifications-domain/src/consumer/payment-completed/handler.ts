import { BaseNotificationHandler } from '../../base-classes'
import type { PaymentCompleted } from '../../infrastructure/events'
import { NotifyPaymentCompletedUseCase } from './use-cases/notify-payment-completed-use-case'

export class PaymentCompletedHandler extends BaseNotificationHandler<PaymentCompleted> {
  readonly subscribedEvents = ['PaymentCompleted']
  constructor(private readonly useCase: NotifyPaymentCompletedUseCase) {
    super()
  }

  handle(event: PaymentCompleted): void {
    console.log(`[Notifications] Handling PaymentCompleted for order ${event.orderId}`)
    this.useCase.apply(event.orderId, event.paymentId, event.amount)
  }
}
