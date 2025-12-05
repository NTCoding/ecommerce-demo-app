import { Payment } from '../../../domain/Payment'
import { PaymentGatewayClient } from '../../../infrastructure/payment-gateway-client'
import {
  publishEvent,
  type PaymentCompleted,
  type PaymentFailed
} from '../../../infrastructure/events'

export class ProcessPaymentUseCase {
  constructor(private paymentGateway: PaymentGatewayClient) {}

  async apply(orderId: string, amount: number): Promise<void> {
    const paymentId = `pay_${Date.now()}`
    const payment = new Payment(paymentId, orderId, amount)

    const authResult = await this.paymentGateway.authorizePayment(
      orderId,
      amount,
      'USD'
    )

    if (authResult.status !== 'authorized') {
      payment.fail()

      const failedEvent: PaymentFailed = {
        type: 'PaymentFailed',
        orderId,
        paymentId,
        reason: 'Authorization declined',
        timestamp: new Date().toISOString()
      }

      publishEvent(failedEvent)
      return
    }

    payment.authorize()

    const completeResult =
      await this.paymentGateway.completePayment(authResult.transactionId)

    if (completeResult.status !== 'completed') {
      payment.fail()

      const failedEvent: PaymentFailed = {
        type: 'PaymentFailed',
        orderId,
        paymentId,
        reason: 'Capture failed after authorization',
        timestamp: new Date().toISOString()
      }

      publishEvent(failedEvent)
      return
    }

    payment.complete()

    const completedEvent: PaymentCompleted = {
      type: 'PaymentCompleted',
      orderId,
      paymentId,
      amount,
      timestamp: new Date().toISOString()
    }

    publishEvent(completedEvent)
  }
}
