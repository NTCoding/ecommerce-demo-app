import { publishEvent } from '../../../infrastructure/events';
export class DispatchShipmentUseCase {
    courierApi;
    constructor(courierApi) {
        this.courierApi = courierApi;
    }
    async apply(shipmentId, shipment) {
        if (!shipment.trackingNumber) {
            throw new Error('Shipment must have tracking number to dispatch');
        }
        await this.courierApi.dispatchShipment(shipment.trackingNumber);
        shipment.dispatch();
        const event = {
            type: 'ShipmentDispatched',
            shipmentId,
            orderId: shipment.orderId,
            courierName: 'FastCourier',
            timestamp: new Date().toISOString()
        };
        publishEvent(event);
    }
}
//# sourceMappingURL=dispatch-shipment-use-case.js.map