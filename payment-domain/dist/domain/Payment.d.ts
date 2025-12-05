export declare enum PaymentState {
    Pending = "Pending",
    Authorized = "Authorized",
    Completed = "Completed",
    Failed = "Failed",
    Refunded = "Refunded"
}
export declare class Payment {
    readonly id: string;
    readonly orderId: string;
    readonly amount: number;
    readonly currency: string;
    private state;
    constructor(id: string, orderId: string, amount: number, currency?: string);
    authorize(): void;
    complete(): void;
    fail(): void;
    refund(): void;
    getState(): PaymentState;
}
//# sourceMappingURL=Payment.d.ts.map