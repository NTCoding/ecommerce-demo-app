import { Order } from '../../domain/Order';
export function handleInventoryReserved(event, useCase) {
    console.log(`[Orders] Handling InventoryReserved for order ${event.orderId}`);
    const order = new Order(event.orderId, 'customer123', event.items);
    useCase.apply(event.orderId, order);
    console.log(`[Orders] Order ${event.orderId} inventory marked as reserved`);
}
//# sourceMappingURL=handler.js.map