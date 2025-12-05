import { Payment } from '../../../domain/Payment'
import { PaymentGatewayClient } from '../../../infrastructure/payment-gateway-client'
import { publishEvent, type PaymentRefunded } from '../../../infrastructure/events'

export class RefundPaymentUseCase {
  constructor(private paymentGateway: PaymentGatewayClient) {}

  async apply(orderId: string, payment: Payment): Promise<void> {
    const refundResult = await this.paymentGateway.refundPayment(
      payment.id,
      payment.amount
    )

    if (refundResult.status === 'refunded') {
      payment.refund()

      const event: PaymentRefunded = {
        type: 'PaymentRefunded',
        orderId,
        paymentId: payment.id,
        amount: payment.amount,
        timestamp: new Date().toISOString()
      }

      publishEvent(event)
    }
  }
}
