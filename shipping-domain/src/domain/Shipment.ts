export enum ShipmentState {
  Pending = 'Pending',
  Created = 'Created',
  Dispatched = 'Dispatched',
  InTransit = 'InTransit',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export class Shipment {
  private state: ShipmentState = ShipmentState.Pending

  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly address: string,
    public trackingNumber?: string
  ) {}

  create(trackingNumber: string): void {
    this.trackingNumber = trackingNumber
    this.state = ShipmentState.Created
  }

  dispatch(): void {
    this.state = ShipmentState.Dispatched
  }

  markInTransit(): void {
    this.state = ShipmentState.InTransit
  }

  deliver(): void {
    this.state = ShipmentState.Delivered
  }

  cancel(): void {
    this.state = ShipmentState.Cancelled
  }

  getState(): ShipmentState {
    return this.state
  }
}
