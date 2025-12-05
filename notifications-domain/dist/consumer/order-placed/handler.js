export function handleOrderPlaced(event, useCase) {
    console.log(`[Notifications] Handling OrderPlaced for order ${event.orderId}`);
    useCase.apply(event.orderId, event.customerId);
}
//# sourceMappingURL=handler.js.map