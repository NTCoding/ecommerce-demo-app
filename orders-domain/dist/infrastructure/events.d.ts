import { EventEmitter } from 'events';
export type OrderPlaced = {
    type: 'OrderPlaced';
    orderId: string;
    customerId: string;
    items: Array<{
        sku: string;
        quantity: number;
    }>;
    totalAmount: number;
    timestamp: string;
};
export type OrderConfirmed = {
    type: 'OrderConfirmed';
    orderId: string;
    timestamp: string;
};
export type OrderCancelled = {
    type: 'OrderCancelled';
    orderId: string;
    reason: string;
    timestamp: string;
};
export type OrderEvent = OrderPlaced | OrderConfirmed | OrderCancelled;
export type InventoryReserved = {
    type: 'InventoryReserved';
    orderId: string;
    items: Array<{
        sku: string;
        quantity: number;
    }>;
    timestamp: string;
};
export type PaymentCompleted = {
    type: 'PaymentCompleted';
    orderId: string;
    paymentId: string;
    amount: number;
    timestamp: string;
};
export type ShipmentCreated = {
    type: 'ShipmentCreated';
    orderId: string;
    shipmentId: string;
    trackingNumber: string;
    timestamp: string;
};
export type ShipmentDelivered = {
    type: 'ShipmentDelivered';
    orderId: string;
    shipmentId: string;
    timestamp: string;
};
export type ExternalEvent = InventoryReserved | PaymentCompleted | ShipmentCreated | ShipmentDelivered;
export declare const eventBus: EventEmitter<[never]>;
export declare function publishEvent(event: OrderEvent | ExternalEvent): void;
export declare function subscribeToEvent<T extends ExternalEvent>(eventType: T['type'], handler: (event: T) => void | Promise<void>): void;
//# sourceMappingURL=events.d.ts.map