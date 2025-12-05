import { publishEvent } from '../../../infrastructure/events';
export class UpdateTrackingUseCase {
    courierApi;
    constructor(courierApi) {
        this.courierApi = courierApi;
    }
    async apply(shipments) {
        for (const [shipmentId, shipment] of shipments.entries()) {
            if (!shipment.trackingNumber) {
                continue;
            }
            const trackingStatus = await this.courierApi.getTrackingStatus(shipment.trackingNumber);
            console.log(`[Shipping Cron] Tracking status for ${shipment.trackingNumber}: ${trackingStatus.status}`);
            if (trackingStatus.status === 'in_transit' && shipment.getState() === 'Dispatched') {
                shipment.markInTransit();
            }
            if (trackingStatus.status === 'delivered' && shipment.getState() === 'InTransit') {
                shipment.deliver();
                const event = {
                    type: 'ShipmentDelivered',
                    orderId: shipment.orderId,
                    shipmentId,
                    timestamp: new Date().toISOString()
                };
                publishEvent(event);
            }
        }
    }
}
//# sourceMappingURL=update-tracking-use-case.js.map