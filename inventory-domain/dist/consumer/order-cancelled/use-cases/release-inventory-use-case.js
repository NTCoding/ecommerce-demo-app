export class ReleaseInventoryUseCase {
    apply(orderId, items, inventoryItems) {
        for (const item of items) {
            const inventoryItem = inventoryItems.get(item.sku);
            if (!inventoryItem) {
                continue;
            }
            inventoryItem.release(item.quantity);
        }
        console.log(`[Inventory] Released inventory for cancelled order ${orderId}`);
    }
}
//# sourceMappingURL=release-inventory-use-case.js.map