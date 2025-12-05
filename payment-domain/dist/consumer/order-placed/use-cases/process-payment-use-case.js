import { Payment } from '../../../domain/Payment';
import { publishEvent } from '../../../infrastructure/events';
export class ProcessPaymentUseCase {
    paymentGateway;
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    async apply(orderId, amount) {
        const paymentId = `pay_${Date.now()}`;
        const payment = new Payment(paymentId, orderId, amount);
        const authResult = await this.paymentGateway.authorizePayment(orderId, amount, 'USD');
        if (authResult.status === 'authorized') {
            payment.authorize();
            const completeResult = await this.paymentGateway.completePayment(authResult.transactionId);
            if (completeResult.status === 'completed') {
                payment.complete();
                const event = {
                    type: 'PaymentCompleted',
                    orderId,
                    paymentId,
                    amount,
                    timestamp: new Date().toISOString()
                };
                publishEvent(event);
            }
        }
    }
}
//# sourceMappingURL=process-payment-use-case.js.map