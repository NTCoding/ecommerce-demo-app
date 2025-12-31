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
    if (this.state !== ShipmentState.Pending) {
      throw new Error('Shipment must be in Pending state to create')
    }
    if (!trackingNumber) {
      throw new Error('Tracking number is required')
    }
    this.trackingNumber = trackingNumber
    this.state = ShipmentState.Created
  }

  dispatch(): void {
    if (this.state !== ShipmentState.Created) {
      throw new Error('Shipment must be in Created state to dispatch')
    }
    this.state = ShipmentState.Dispatched
  }

  markInTransit(): void {
    if (this.state !== ShipmentState.Dispatched) {
      throw new Error('Shipment must be in Dispatched state to mark in transit')
    }
    this.state = ShipmentState.InTransit
  }

  deliver(): void {
    if (this.state !== ShipmentState.InTransit) {
      throw new Error('Shipment must be in InTransit state to deliver')
    }
    this.state = ShipmentState.Delivered
  }

  cancel(): void {
    if (this.state === ShipmentState.Delivered) {
      throw new Error('Cannot cancel a delivered shipment')
    }
    if (this.state === ShipmentState.Cancelled) {
      throw new Error('Shipment is already cancelled')
    }
    this.state = ShipmentState.Cancelled
  }

  getState(): ShipmentState {
    return this.state
  }
}
