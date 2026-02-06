import { Payment } from '../../../domain/Payment'
import { IPaymentUseCase } from '../../../interfaces'
import { PaymentGatewayClient } from '../../../infrastructure/payment-gateway-client'
import { PaymentEventPublisher } from '../../../infrastructure/payment-event-publisher'
import { PaymentRefunded } from '../../../infrastructure/events'

export class RefundPaymentUseCase implements IPaymentUseCase {
  constructor(
    private paymentGateway: PaymentGatewayClient,
    private readonly publisher: PaymentEventPublisher
  ) {}

  async apply(orderId: string, payment: Payment): Promise<void> {
    const refundResult = await this.paymentGateway.refundPayment(
      payment.id,
      payment.amount
    )

    if (refundResult.status === 'refunded') {
      payment.refund()
      this.publisher.publishPaymentRefunded(new PaymentRefunded(orderId, payment.id, payment.amount))
    }
  }
}
