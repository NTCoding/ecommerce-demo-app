import { InventoryItem } from '../../../domain/InventoryItem';
export declare class ReserveInventoryUseCase {
    apply(orderId: string, items: Array<{
        sku: string;
        quantity: number;
    }>, inventoryItems: Map<string, InventoryItem>): void;
}
//# sourceMappingURL=reserve-inventory-use-case.d.ts.map