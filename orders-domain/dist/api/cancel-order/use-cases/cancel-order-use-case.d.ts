import { Order } from '../../../domain/Order';
export type CancelOrderRequest = {
    orderId: string;
    reason: string;
};
export declare class CancelOrderUseCase {
    apply(request: CancelOrderRequest, order: Order): void;
}
//# sourceMappingURL=cancel-order-use-case.d.ts.map