import { InventoryItem } from '../../../domain/InventoryItem';
export declare class ReleaseInventoryUseCase {
    apply(orderId: string, items: Array<{
        sku: string;
        quantity: number;
    }>, inventoryItems: Map<string, InventoryItem>): void;
}
//# sourceMappingURL=release-inventory-use-case.d.ts.map