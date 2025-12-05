import { publishEvent } from '../../../infrastructure/events';
export class CancelOrderUseCase {
    apply(request, order) {
        order.cancel();
        const event = {
            type: 'OrderCancelled',
            orderId: request.orderId,
            reason: request.reason,
            timestamp: new Date().toISOString()
        };
        publishEvent(event);
    }
}
//# sourceMappingURL=cancel-order-use-case.js.map