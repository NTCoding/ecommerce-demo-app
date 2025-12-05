export declare enum InventoryState {
    Available = "Available",
    Reserved = "Reserved",
    Allocated = "Allocated",
    Depleted = "Depleted"
}
export declare class InventoryItem {
    readonly sku: string;
    availableQuantity: number;
    reservedQuantity: number;
    allocatedQuantity: number;
    private state;
    constructor(sku: string, availableQuantity: number, reservedQuantity?: number, allocatedQuantity?: number);
    reserve(quantity: number): void;
    allocate(quantity: number): void;
    release(quantity: number): void;
    replenish(quantity: number): void;
    markDepleted(): void;
    getState(): InventoryState;
}
//# sourceMappingURL=InventoryItem.d.ts.map