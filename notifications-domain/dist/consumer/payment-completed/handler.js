export function handlePaymentCompleted(event, useCase) {
    console.log(`[Notifications] Handling PaymentCompleted for order ${event.orderId}`);
    useCase.apply(event.orderId, event.paymentId, event.amount);
}
//# sourceMappingURL=handler.js.map