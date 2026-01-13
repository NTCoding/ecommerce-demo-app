import { Payment } from '../../../domain/Payment'
import { IPaymentUseCase } from '../../../interfaces'
import { PaymentGatewayClient } from '../../../infrastructure/payment-gateway-client'
import { publishEvent, PaymentRefunded } from '../../../infrastructure/events'

export class RefundPaymentUseCase implements IPaymentUseCase {
  constructor(private paymentGateway: PaymentGatewayClient) {}

  async apply(orderId: string, payment: Payment): Promise<void> {
    const refundResult = await this.paymentGateway.refundPayment(
      payment.id,
      payment.amount
    )

    if (refundResult.status === 'refunded') {
      payment.refund()
      publishEvent(new PaymentRefunded(orderId, payment.id, payment.amount))
    }
  }
}
