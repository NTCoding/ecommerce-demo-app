export enum PaymentState {
  Pending = 'Pending',
  Authorized = 'Authorized',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded'
}

export class Payment {
  private state: PaymentState = PaymentState.Pending

  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly currency: string = 'USD'
  ) {}

  authorize(): void {
    this.state = PaymentState.Authorized
  }

  complete(): void {
    this.state = PaymentState.Completed
  }

  fail(): void {
    this.state = PaymentState.Failed
  }

  refund(): void {
    this.state = PaymentState.Refunded
  }

  getState(): PaymentState {
    return this.state
  }
}
