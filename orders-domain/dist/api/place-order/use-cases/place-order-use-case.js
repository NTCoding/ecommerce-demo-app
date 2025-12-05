import { Order } from '../../../domain/Order';
import { publishEvent } from '../../../infrastructure/events';
export class PlaceOrderUseCase {
    apply(request) {
        const orderId = `order_${Date.now()}`;
        const order = new Order(orderId, request.customerId, request.items);
        order.begin();
        const event = {
            type: 'OrderPlaced',
            orderId,
            customerId: request.customerId,
            items: request.items,
            totalAmount: request.totalAmount,
            timestamp: new Date().toISOString()
        };
        publishEvent(event);
        return order;
    }
}
//# sourceMappingURL=place-order-use-case.js.map