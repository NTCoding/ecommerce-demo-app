export var InventoryState;
(function (InventoryState) {
    InventoryState["Available"] = "Available";
    InventoryState["Reserved"] = "Reserved";
    InventoryState["Allocated"] = "Allocated";
    InventoryState["Depleted"] = "Depleted";
})(InventoryState || (InventoryState = {}));
export class InventoryItem {
    sku;
    availableQuantity;
    reservedQuantity;
    allocatedQuantity;
    state = InventoryState.Available;
    constructor(sku, availableQuantity, reservedQuantity = 0, allocatedQuantity = 0) {
        this.sku = sku;
        this.availableQuantity = availableQuantity;
        this.reservedQuantity = reservedQuantity;
        this.allocatedQuantity = allocatedQuantity;
    }
    reserve(quantity) {
        if (this.availableQuantity >= quantity) {
            this.availableQuantity -= quantity;
            this.reservedQuantity += quantity;
            this.state = InventoryState.Reserved;
        }
    }
    allocate(quantity) {
        if (this.reservedQuantity >= quantity) {
            this.reservedQuantity -= quantity;
            this.allocatedQuantity += quantity;
            this.state = InventoryState.Allocated;
        }
    }
    release(quantity) {
        this.reservedQuantity -= quantity;
        this.availableQuantity += quantity;
        if (this.reservedQuantity === 0 && this.allocatedQuantity === 0) {
            this.state = InventoryState.Available;
        }
    }
    replenish(quantity) {
        this.availableQuantity += quantity;
        this.state = InventoryState.Available;
    }
    markDepleted() {
        if (this.availableQuantity === 0) {
            this.state = InventoryState.Depleted;
        }
    }
    getState() {
        return this.state;
    }
}
//# sourceMappingURL=InventoryItem.js.map