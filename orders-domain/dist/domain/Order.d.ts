export declare enum OrderState {
    Draft = "Draft",
    Placed = "Placed",
    InventoryReserved = "InventoryReserved",
    PaymentCompleted = "PaymentCompleted",
    Confirmed = "Confirmed",
    Shipped = "Shipped",
    Delivered = "Delivered",
    Cancelled = "Cancelled"
}
export declare class Order {
    readonly id: string;
    readonly customerId: string;
    readonly items: Array<{
        sku: string;
        quantity: number;
    }>;
    private state;
    private inventoryReserved;
    private paymentCompleted;
    constructor(id: string, customerId: string, items: Array<{
        sku: string;
        quantity: number;
    }>);
    begin(): void;
    markInventoryReserved(): void;
    markPaymentCompleted(): void;
    private checkCanConfirm;
    confirm(): void;
    ship(): void;
    deliver(): void;
    cancel(): void;
    getState(): OrderState;
}
//# sourceMappingURL=Order.d.ts.map