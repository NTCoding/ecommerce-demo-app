export type PaymentGatewayResponse = {
    transactionId: string;
    status: 'authorized' | 'completed' | 'failed';
    message: string;
};
export declare class PaymentGatewayClient {
    authorizePayment(orderId: string, amount: number, currency: string): Promise<PaymentGatewayResponse>;
    completePayment(transactionId: string): Promise<PaymentGatewayResponse>;
    refundPayment(transactionId: string, amount: number): Promise<PaymentGatewayResponse>;
}
//# sourceMappingURL=payment-gateway-client.d.ts.map