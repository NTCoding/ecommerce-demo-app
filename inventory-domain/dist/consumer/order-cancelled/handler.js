export function handleOrderCancelled(event, useCase, inventoryItems) {
    console.log(`[Inventory] Handling OrderCancelled for order ${event.orderId}`);
    useCase.apply(event.orderId, [], inventoryItems);
}
//# sourceMappingURL=handler.js.map