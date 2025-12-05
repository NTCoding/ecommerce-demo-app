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
export type PaymentCompleted = {
    type: 'PaymentCompleted';
    orderId: string;
    paymentId: string;
    amount: number;
    timestamp: string;
};
export type ShipmentDispatched = {
    type: 'ShipmentDispatched';
    shipmentId: string;
    orderId: string;
    courierName: string;
    timestamp: string;
};
export type ShipmentDelivered = {
    type: 'ShipmentDelivered';
    orderId: string;
    shipmentId: string;
    timestamp: string;
};
export type ExternalEvent = OrderPlaced | PaymentCompleted | ShipmentDispatched | ShipmentDelivered;
export declare const eventBus: EventEmitter<[never]>;
export declare function subscribeToEvent(eventType: 'OrderPlaced', handler: (event: OrderPlaced) => void): void;
export declare function subscribeToEvent(eventType: 'PaymentCompleted', handler: (event: PaymentCompleted) => void): void;
export declare function subscribeToEvent(eventType: 'ShipmentDispatched', handler: (event: ShipmentDispatched) => void): void;
export declare function subscribeToEvent(eventType: 'ShipmentDelivered', handler: (event: ShipmentDelivered) => void): void;
//# sourceMappingURL=events.d.ts.map