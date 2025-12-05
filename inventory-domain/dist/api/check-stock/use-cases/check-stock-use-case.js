export class CheckStockUseCase {
    apply(sku, inventoryItems) {
        const item = inventoryItems.get(sku);
        if (!item) {
            throw new Error(`SKU not found: ${sku}`);
        }
        return {
            sku: item.sku,
            available: item.availableQuantity,
            reserved: item.reservedQuantity,
            allocated: item.allocatedQuantity,
            state: item.getState()
        };
    }
}
//# sourceMappingURL=check-stock-use-case.js.map