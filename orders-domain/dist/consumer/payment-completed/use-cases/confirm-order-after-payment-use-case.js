import { publishEvent } from '../../../infrastructure/events';
export class ConfirmOrderAfterPaymentUseCase {
    apply(orderId, order) {
        order.markPaymentCompleted();
        if (order.getState() === 'Confirmed') {
            const event = {
                type: 'OrderConfirmed',
                orderId,
                timestamp: new Date().toISOString()
            };
            publishEvent(event);
        }
    }
}
//# sourceMappingURL=confirm-order-after-payment-use-case.js.map