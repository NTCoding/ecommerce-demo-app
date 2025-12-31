export enum OrderState {
  Draft = 'Draft',
  Placed = 'Placed',
  InventoryReserved = 'InventoryReserved',
  PaymentCompleted = 'PaymentCompleted',
  Confirmed = 'Confirmed',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export type OrderItem = { sku: string; quantity: number; price: number }

export class Order {
  private state: OrderState = OrderState.Draft
  private inventoryReserved: boolean = false
  private paymentCompleted: boolean = false
  private total: number = 0
  private placedAt: Date | null = null

  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: OrderItem[]
  ) {}

  begin(): void {
    if (this.state !== OrderState.Draft) {
      throw new Error('Order must be in Draft state to begin')
    }
    if (this.items.length === 0) {
      throw new Error('Order must have at least one item')
    }
    if (!this.customerId) {
      throw new Error('Order must have a customer')
    }

    this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    this.placedAt = new Date()
    this.state = OrderState.Placed
  }

  markInventoryReserved(): void {
    if (this.state !== OrderState.Placed && this.state !== OrderState.PaymentCompleted) {
      throw new Error('Order must be in Placed or PaymentCompleted state to mark inventory reserved')
    }
    this.inventoryReserved = true
    this.state = OrderState.InventoryReserved
    this.checkCanConfirm()
  }

  markPaymentCompleted(): void {
    if (this.state !== OrderState.Placed && this.state !== OrderState.InventoryReserved) {
      throw new Error('Order must be in Placed or InventoryReserved state to mark payment completed')
    }
    this.paymentCompleted = true
    this.state = OrderState.PaymentCompleted
    this.checkCanConfirm()
  }

  private checkCanConfirm(): void {
    if (this.inventoryReserved && this.paymentCompleted) {
      this.confirm()
    }
  }

  confirm(): void {
    if (!this.inventoryReserved || !this.paymentCompleted) {
      throw new Error('Order must have inventory reserved and payment completed to confirm')
    }
    this.state = OrderState.Confirmed
  }

  ship(): void {
    if (this.state !== OrderState.Confirmed) {
      throw new Error('Order must be in Confirmed state to ship')
    }
    this.state = OrderState.Shipped
  }

  deliver(): void {
    if (this.state !== OrderState.Shipped) {
      throw new Error('Order must be in Shipped state to deliver')
    }
    this.state = OrderState.Delivered
  }

  cancel(): void {
    if (this.state === OrderState.Delivered) {
      throw new Error('Cannot cancel a delivered order')
    }
    if (this.state === OrderState.Cancelled) {
      throw new Error('Order is already cancelled')
    }
    this.state = OrderState.Cancelled
  }

  getState(): OrderState {
    return this.state
  }

  getTotal(): number {
    return this.total
  }

  getPlacedAt(): Date | null {
    return this.placedAt
  }
}
