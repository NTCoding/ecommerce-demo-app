import { Order } from '../../domain/Order';
export function handlePaymentCompleted(event, useCase) {
    console.log(`[Orders] Handling PaymentCompleted for order ${event.orderId}`);
    const order = new Order(event.orderId, 'customer123', []);
    useCase.apply(event.orderId, order);
    console.log(`[Orders] Order ${event.orderId} payment marked as completed`);
}
//# sourceMappingURL=handler.js.map