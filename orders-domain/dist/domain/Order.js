export var OrderState;
(function (OrderState) {
    OrderState["Draft"] = "Draft";
    OrderState["Placed"] = "Placed";
    OrderState["InventoryReserved"] = "InventoryReserved";
    OrderState["PaymentCompleted"] = "PaymentCompleted";
    OrderState["Confirmed"] = "Confirmed";
    OrderState["Shipped"] = "Shipped";
    OrderState["Delivered"] = "Delivered";
    OrderState["Cancelled"] = "Cancelled";
})(OrderState || (OrderState = {}));
export class Order {
    id;
    customerId;
    items;
    state = OrderState.Draft;
    inventoryReserved = false;
    paymentCompleted = false;
    constructor(id, customerId, items) {
        this.id = id;
        this.customerId = customerId;
        this.items = items;
    }
    begin() {
        this.state = OrderState.Placed;
    }
    markInventoryReserved() {
        this.inventoryReserved = true;
        this.state = OrderState.InventoryReserved;
        this.checkCanConfirm();
    }
    markPaymentCompleted() {
        this.paymentCompleted = true;
        this.state = OrderState.PaymentCompleted;
        this.checkCanConfirm();
    }
    checkCanConfirm() {
        if (this.inventoryReserved && this.paymentCompleted) {
            this.confirm();
        }
    }
    confirm() {
        this.state = OrderState.Confirmed;
    }
    ship() {
        this.state = OrderState.Shipped;
    }
    deliver() {
        this.state = OrderState.Delivered;
    }
    cancel() {
        this.state = OrderState.Cancelled;
    }
    getState() {
        return this.state;
    }
}
//# sourceMappingURL=Order.js.map