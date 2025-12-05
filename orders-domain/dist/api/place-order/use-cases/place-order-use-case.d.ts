import { Order } from '../../../domain/Order';
export type PlaceOrderRequest = {
    customerId: string;
    items: Array<{
        sku: string;
        quantity: number;
    }>;
    totalAmount: number;
};
export declare class PlaceOrderUseCase {
    apply(request: PlaceOrderRequest): Order;
}
//# sourceMappingURL=place-order-use-case.d.ts.map