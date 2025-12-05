import { InventoryItem } from '../../../domain/InventoryItem';
export type StockInfo = {
    sku: string;
    available: number;
    reserved: number;
    allocated: number;
    state: string;
};
export declare class CheckStockUseCase {
    apply(sku: string, inventoryItems: Map<string, InventoryItem>): StockInfo;
}
//# sourceMappingURL=check-stock-use-case.d.ts.map