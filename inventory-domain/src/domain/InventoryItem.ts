import { StockOp } from '../decorators'

export enum InventoryState {
  Available = 'Available',
  Reserved = 'Reserved',
  Allocated = 'Allocated',
  Depleted = 'Depleted'
}

@StockOp
export class InventoryItem {
  private state: InventoryState = InventoryState.Available

  constructor(
    public readonly sku: string,
    public availableQuantity: number,
    public reservedQuantity: number = 0,
    public allocatedQuantity: number = 0
  ) {}

  reserve(quantity: number): void {
    if (this.availableQuantity < quantity) {
      throw new Error('Insufficient available quantity to reserve')
    }
    this.availableQuantity -= quantity
    this.reservedQuantity += quantity
    this.state = InventoryState.Reserved
  }

  allocate(quantity: number): void {
    if (this.reservedQuantity < quantity) {
      throw new Error('Insufficient reserved quantity to allocate')
    }
    this.reservedQuantity -= quantity
    this.allocatedQuantity += quantity
    this.state = InventoryState.Allocated
  }

  release(quantity: number): void {
    if (this.reservedQuantity < quantity) {
      throw new Error('Cannot release more than reserved quantity')
    }
    this.reservedQuantity -= quantity
    this.availableQuantity += quantity

    if (this.reservedQuantity === 0 && this.allocatedQuantity === 0) {
      this.state = InventoryState.Available
    }
  }

  replenish(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Replenish quantity must be positive')
    }
    this.availableQuantity += quantity
    this.state = InventoryState.Available
  }

  markDepleted(): void {
    if (this.availableQuantity !== 0) {
      throw new Error('Cannot mark as depleted when available quantity is not zero')
    }
    this.state = InventoryState.Depleted
  }

  getState(): InventoryState {
    return this.state
  }
}
