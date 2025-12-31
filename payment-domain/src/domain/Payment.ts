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
    if (this.state !== PaymentState.Pending) {
      throw new Error('Payment must be in Pending state to authorize')
    }
    this.state = PaymentState.Authorized
  }

  complete(): void {
    if (this.state !== PaymentState.Authorized) {
      throw new Error('Payment must be in Authorized state to complete')
    }
    this.state = PaymentState.Completed
  }

  fail(): void {
    if (this.state !== PaymentState.Authorized) {
      throw new Error('Payment must be in Authorized state to fail')
    }
    this.state = PaymentState.Failed
  }

  refund(): void {
    if (this.state !== PaymentState.Completed) {
      throw new Error('Payment must be in Completed state to refund')
    }
    this.state = PaymentState.Refunded
  }

  getState(): PaymentState {
    return this.state
  }
}
