export enum InventoryState {
  Available = 'Available',
  Reserved = 'Reserved',
  Allocated = 'Allocated',
  Depleted = 'Depleted'
}

export class InventoryItem {
  private state: InventoryState = InventoryState.Available

  constructor(
    public readonly sku: string,
    public availableQuantity: number,
    public reservedQuantity: number = 0,
    public allocatedQuantity: number = 0
  ) {}

  reserve(quantity: number): void {
    if (this.availableQuantity >= quantity) {
      this.availableQuantity -= quantity
      this.reservedQuantity += quantity
      this.state = InventoryState.Reserved
    }
  }

  allocate(quantity: number): void {
    if (this.reservedQuantity >= quantity) {
      this.reservedQuantity -= quantity
      this.allocatedQuantity += quantity
      this.state = InventoryState.Allocated
    }
  }

  release(quantity: number): void {
    this.reservedQuantity -= quantity
    this.availableQuantity += quantity

    if (this.reservedQuantity === 0 && this.allocatedQuantity === 0) {
      this.state = InventoryState.Available
    }
  }

  replenish(quantity: number): void {
    this.availableQuantity += quantity
    this.state = InventoryState.Available
  }

  markDepleted(): void {
    if (this.availableQuantity === 0) {
      this.state = InventoryState.Depleted
    }
  }

  getState(): InventoryState {
    return this.state
  }
}
