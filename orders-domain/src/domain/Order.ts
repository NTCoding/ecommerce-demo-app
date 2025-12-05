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

export class Order {
  private state: OrderState = OrderState.Draft
  private inventoryReserved: boolean = false
  private paymentCompleted: boolean = false

  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: Array<{ sku: string; quantity: number }>
  ) {}

  begin(): void {
    this.state = OrderState.Placed
  }

  markInventoryReserved(): void {
    this.inventoryReserved = true
    this.state = OrderState.InventoryReserved
    this.checkCanConfirm()
  }

  markPaymentCompleted(): void {
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
    this.state = OrderState.Confirmed
  }

  ship(): void {
    this.state = OrderState.Shipped
  }

  deliver(): void {
    this.state = OrderState.Delivered
  }

  cancel(): void {
    this.state = OrderState.Cancelled
  }

  getState(): OrderState {
    return this.state
  }
}
