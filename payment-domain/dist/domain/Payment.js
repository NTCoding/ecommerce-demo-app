export var PaymentState;
(function (PaymentState) {
    PaymentState["Pending"] = "Pending";
    PaymentState["Authorized"] = "Authorized";
    PaymentState["Completed"] = "Completed";
    PaymentState["Failed"] = "Failed";
    PaymentState["Refunded"] = "Refunded";
})(PaymentState || (PaymentState = {}));
export class Payment {
    id;
    orderId;
    amount;
    currency;
    state = PaymentState.Pending;
    constructor(id, orderId, amount, currency = 'USD') {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
    }
    authorize() {
        this.state = PaymentState.Authorized;
    }
    complete() {
        this.state = PaymentState.Completed;
    }
    fail() {
        this.state = PaymentState.Failed;
    }
    refund() {
        this.state = PaymentState.Refunded;
    }
    getState() {
        return this.state;
    }
}
//# sourceMappingURL=Payment.js.map