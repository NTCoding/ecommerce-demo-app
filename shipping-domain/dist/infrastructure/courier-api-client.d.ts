export type CourierShipmentRequest = {
    orderId: string;
    address: string;
    items: Array<{
        sku: string;
        quantity: number;
    }>;
};
export type CourierShipmentResponse = {
    shipmentId: string;
    trackingNumber: string;
    estimatedDelivery: string;
};
export type TrackingStatus = {
    trackingNumber: string;
    status: 'created' | 'dispatched' | 'in_transit' | 'delivered';
    lastUpdate: string;
    location?: string;
};
export declare class CourierApiClient {
    createShipment(request: CourierShipmentRequest): Promise<CourierShipmentResponse>;
    dispatchShipment(trackingNumber: string): Promise<void>;
    getTrackingStatus(trackingNumber: string): Promise<TrackingStatus>;
}
//# sourceMappingURL=courier-api-client.d.ts.map