export function handleOrderPlaced(event, useCase) {
    console.log(`[Payment] Handling OrderPlaced for order ${event.orderId}`);
    useCase.apply(event.orderId, event.totalAmount);
    console.log(`[Payment] Processing payment for order ${event.orderId}`);
}
//# sourceMappingURL=handler.js.map