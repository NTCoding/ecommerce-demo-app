import { Shipment } from '../../../domain/Shipment';
import { publishEvent } from '../../../infrastructure/events';
export class CreateShipmentUseCase {
    courierApi;
    constructor(courierApi) {
        this.courierApi = courierApi;
    }
    async apply(orderId, address) {
        const shipmentId = `ship_${Date.now()}`;
        const courierResponse = await this.courierApi.createShipment({
            orderId,
            address,
            items: []
        });
        const shipment = new Shipment(shipmentId, orderId, address, courierResponse.trackingNumber);
        shipment.create(courierResponse.trackingNumber);
        const event = {
            type: 'ShipmentCreated',
            orderId,
            shipmentId,
            trackingNumber: courierResponse.trackingNumber,
            timestamp: new Date().toISOString()
        };
        publishEvent(event);
    }
}
//# sourceMappingURL=create-shipment-use-case.js.map