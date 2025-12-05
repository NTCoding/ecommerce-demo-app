export var ShipmentState;
(function (ShipmentState) {
    ShipmentState["Pending"] = "Pending";
    ShipmentState["Created"] = "Created";
    ShipmentState["Dispatched"] = "Dispatched";
    ShipmentState["InTransit"] = "InTransit";
    ShipmentState["Delivered"] = "Delivered";
    ShipmentState["Cancelled"] = "Cancelled";
})(ShipmentState || (ShipmentState = {}));
export class Shipment {
    id;
    orderId;
    address;
    trackingNumber;
    state = ShipmentState.Pending;
    constructor(id, orderId, address, trackingNumber) {
        this.id = id;
        this.orderId = orderId;
        this.address = address;
        this.trackingNumber = trackingNumber;
    }
    create(trackingNumber) {
        this.trackingNumber = trackingNumber;
        this.state = ShipmentState.Created;
    }
    dispatch() {
        this.state = ShipmentState.Dispatched;
    }
    markInTransit() {
        this.state = ShipmentState.InTransit;
    }
    deliver() {
        this.state = ShipmentState.Delivered;
    }
    cancel() {
        this.state = ShipmentState.Cancelled;
    }
    getState() {
        return this.state;
    }
}
//# sourceMappingURL=Shipment.js.map