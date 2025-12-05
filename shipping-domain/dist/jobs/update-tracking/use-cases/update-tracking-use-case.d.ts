import { Shipment } from '../../../domain/Shipment';
import { CourierApiClient } from '../../../infrastructure/courier-api-client';
export declare class UpdateTrackingUseCase {
    private courierApi;
    constructor(courierApi: CourierApiClient);
    apply(shipments: Map<string, Shipment>): Promise<void>;
}
//# sourceMappingURL=update-tracking-use-case.d.ts.map