export declare enum ShipmentState {
    Pending = "Pending",
    Created = "Created",
    Dispatched = "Dispatched",
    InTransit = "InTransit",
    Delivered = "Delivered",
    Cancelled = "Cancelled"
}
export declare class Shipment {
    readonly id: string;
    readonly orderId: string;
    readonly address: string;
    trackingNumber?: string | undefined;
    private state;
    constructor(id: string, orderId: string, address: string, trackingNumber?: string | undefined);
    create(trackingNumber: string): void;
    dispatch(): void;
    markInTransit(): void;
    deliver(): void;
    cancel(): void;
    getState(): ShipmentState;
}
//# sourceMappingURL=Shipment.d.ts.map