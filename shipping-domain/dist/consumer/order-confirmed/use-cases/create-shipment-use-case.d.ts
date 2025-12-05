import { CourierApiClient } from '../../../infrastructure/courier-api-client';
export declare class CreateShipmentUseCase {
    private courierApi;
    constructor(courierApi: CourierApiClient);
    apply(orderId: string, address: string): Promise<void>;
}
//# sourceMappingURL=create-shipment-use-case.d.ts.map