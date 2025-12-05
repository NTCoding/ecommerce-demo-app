export class ConfirmOrderAfterInventoryUseCase {
    apply(orderId, order) {
        order.markInventoryReserved();
    }
}
//# sourceMappingURL=confirm-order-after-inventory-use-case.js.map