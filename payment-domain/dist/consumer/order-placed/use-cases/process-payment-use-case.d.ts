import { PaymentGatewayClient } from '../../../infrastructure/payment-gateway-client';
export declare class ProcessPaymentUseCase {
    private paymentGateway;
    constructor(paymentGateway: PaymentGatewayClient);
    apply(orderId: string, amount: number): Promise<void>;
}
//# sourceMappingURL=process-payment-use-case.d.ts.map