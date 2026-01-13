import { Event } from '@living-architecture/riviere-extract-conventions'
import { EventEmitter } from 'events'

@Event
export class OrderPlaced {
  readonly type = 'OrderPlaced' as const
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly items: Array<{ sku: string; quantity: number; price: number }>,
    public readonly totalAmount: number,
    public readonly timestamp: string = new Date().toISOString()
  ) {}
}

@Event
export class OrderConfirmed {
  readonly type = 'OrderConfirmed' as const
  constructor(
    public readonly orderId: string,
    public readonly timestamp: string = new Date().toISOString()
  ) {}
}

@Event
export class OrderCancelled {
  readonly type = 'OrderCancelled' as const
  constructor(
    public readonly orderId: string,
    public readonly reason: string,
    public readonly timestamp: string = new Date().toISOString()
  ) {}
}

export type OrderEvent = OrderPlaced | OrderConfirmed | OrderCancelled

// External events (from other domains) - types only, not our events
export type InventoryReserved = {
  type: 'InventoryReserved'
  orderId: string
  items: Array<{ sku: string; quantity: number; price: number }>
  timestamp: string
}

export type PaymentCompleted = {
  type: 'PaymentCompleted'
  orderId: string
  paymentId: string
  amount: number
  timestamp: string
}

export type PaymentFailed = {
  type: 'PaymentFailed'
  orderId: string
  paymentId: string
  reason: string
  timestamp: string
}

export type ShipmentCreated = {
  type: 'ShipmentCreated'
  orderId: string
  shipmentId: string
  trackingNumber: string
  timestamp: string
}

export type ShipmentDispatched = {
  type: 'ShipmentDispatched'
  shipmentId: string
  orderId: string
  courierName: string
  timestamp: string
}

export type ShipmentDelivered = {
  type: 'ShipmentDelivered'
  orderId: string
  shipmentId: string
  timestamp: string
}

export type ExternalEvent =
  | InventoryReserved
  | PaymentCompleted
  | PaymentFailed
  | ShipmentCreated
  | ShipmentDispatched
  | ShipmentDelivered

export const eventBus = new EventEmitter()

export function publishEvent(event: OrderEvent | ExternalEvent): void {
  eventBus.emit(event.type, event)
  console.log(`[Orders] Published event: ${event.type}`, event)
}

export function subscribeToEvent<T extends ExternalEvent>(
  eventType: T['type'],
  handler: (event: T) => void | Promise<void>
): void {
  eventBus.on(eventType, handler)
  console.log(`[Orders] Subscribed to event: ${eventType}`)
}
