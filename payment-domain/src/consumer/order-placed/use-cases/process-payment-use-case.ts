import { Payment } from '../../../domain/Payment'
import { IPaymentUseCase } from '../../../interfaces'
import { PaymentGatewayClient } from '../../../infrastructure/payment-gateway-client'
import {
  publishEvent,
  PaymentCompleted,
  PaymentFailed
} from '../../../infrastructure/events'

export class ProcessPaymentUseCase implements IPaymentUseCase {
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
      publishEvent(new PaymentFailed(orderId, paymentId, 'Authorization declined'))
      return
    }

    payment.authorize()

    const completeResult =
      await this.paymentGateway.completePayment(authResult.transactionId)

    if (completeResult.status !== 'completed') {
      payment.fail()
      publishEvent(new PaymentFailed(orderId, paymentId, 'Capture failed after authorization'))
      return
    }

    payment.complete()
    publishEvent(new PaymentCompleted(orderId, paymentId, amount))
  }
}
