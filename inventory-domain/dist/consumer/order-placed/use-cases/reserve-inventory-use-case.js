import { publishEvent } from '../../../infrastructure/events';
export class ReserveInventoryUseCase {
    apply(orderId, items, inventoryItems) {
        for (const item of items) {
            const inventoryItem = inventoryItems.get(item.sku);
            if (!inventoryItem) {
                throw new Error(`Inventory item not found for SKU: ${item.sku}`);
            }
            inventoryItem.reserve(item.quantity);
        }
        const event = {
            type: 'InventoryReserved',
            orderId,
            items,
            timestamp: new Date().toISOString()
        };
        publishEvent(event);
    }
}
//# sourceMappingURL=reserve-inventory-use-case.js.map