import { EventEmitter } from 'events';
export type InventoryReserved = {
    type: 'InventoryReserved';
    orderId: string;
    items: Array<{
        sku: string;
        quantity: number;
    }>;
    timestamp: string;
};
export type InventoryEvent = InventoryReserved;
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
export type OrderCancelled = {
    type: 'OrderCancelled';
    orderId: string;
    reason: string;
    timestamp: string;
};
export type ExternalEvent = OrderPlaced | OrderCancelled;
export declare const eventBus: EventEmitter<[never]>;
export declare function publishEvent(event: InventoryEvent): void;
export declare function subscribeToEvent<T extends ExternalEvent>(eventType: T['type'], handler: (event: T) => void | Promise<void>): void;
//# sourceMappingURL=events.d.ts.map