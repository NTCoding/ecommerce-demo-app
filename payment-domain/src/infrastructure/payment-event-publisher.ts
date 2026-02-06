import type { IPaymentEventPublisher } from '../interfaces'
import { eventBus, PaymentCompleted, PaymentFailed, PaymentRefunded } from './events'

export class PaymentEventPublisher implements IPaymentEventPublisher {
  publishPaymentCompleted(event: PaymentCompleted): void {
    eventBus.emit(event.type, event)
    console.log(`[Payment] Published event: ${event.type}`, event)
  }

  publishPaymentFailed(event: PaymentFailed): void {
    eventBus.emit(event.type, event)
    console.log(`[Payment] Published event: ${event.type}`, event)
  }

  publishPaymentRefunded(event: PaymentRefunded): void {
    eventBus.emit(event.type, event)
    console.log(`[Payment] Published event: ${event.type}`, event)
  }
}
