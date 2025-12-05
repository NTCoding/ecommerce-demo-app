import { EventEmitter } from 'events';
export type ShipmentCreated = {
    type: 'ShipmentCreated';
    orderId: string;
    shipmentId: string;
    trackingNumber: string;
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
export type ShipmentEvent = ShipmentCreated | ShipmentDispatched | ShipmentDelivered;
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
export type ExternalEvent = OrderConfirmed | OrderCancelled;
export declare const eventBus: EventEmitter<[never]>;
export declare function publishEvent(event: ShipmentEvent): void;
export declare function subscribeToEvent<T extends ExternalEvent>(eventType: T['type'], handler: (event: T) => void | Promise<void>): void;
//# sourceMappingURL=events.d.ts.map