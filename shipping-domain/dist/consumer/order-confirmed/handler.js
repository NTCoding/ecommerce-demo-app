export function handleOrderConfirmed(event, useCase) {
    console.log(`[Shipping] Handling OrderConfirmed for order ${event.orderId}`);
    useCase.apply(event.orderId, '123 Main St, City, Country');
    console.log(`[Shipping] Creating shipment for order ${event.orderId}`);
}
//# sourceMappingURL=handler.js.map