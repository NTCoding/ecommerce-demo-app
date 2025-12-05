import { Shipment } from '../../../domain/Shipment';
import { CourierApiClient } from '../../../infrastructure/courier-api-client';
export declare class DispatchShipmentUseCase {
    private courierApi;
    constructor(courierApi: CourierApiClient);
    apply(shipmentId: string, shipment: Shipment): Promise<void>;
}
//# sourceMappingURL=dispatch-shipment-use-case.d.ts.map