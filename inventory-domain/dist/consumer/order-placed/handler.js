export function handleOrderPlaced(event, useCase, inventoryItems) {
    console.log(`[Inventory] Handling OrderPlaced for order ${event.orderId}`);
    useCase.apply(event.orderId, event.items, inventoryItems);
    console.log(`[Inventory] Reserved inventory for order ${event.orderId}`);
}
//# sourceMappingURL=handler.js.map