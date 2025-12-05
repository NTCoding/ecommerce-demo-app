import { Order } from '../../domain/Order';
export function handleShipmentDelivered(event, useCase) {
    console.log(`[Orders] Handling ShipmentDelivered for order ${event.orderId}`);
    const order = new Order(event.orderId, 'customer123', []);
    useCase.apply(event.orderId, order);
    console.log(`[Orders] Order ${event.orderId} marked as delivered`);
}
//# sourceMappingURL=handler.js.map