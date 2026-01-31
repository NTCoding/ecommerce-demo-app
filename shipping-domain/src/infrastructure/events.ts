import type { EventDef } from '@living-architecture/riviere-extract-conventions'
import { EventEmitter } from 'events'

/** @event */
export class ShipmentCreated implements EventDef {
  readonly type = 'ShipmentCreated'
  constructor(
    public readonly orderId: string,
    public readonly shipmentId: string,
    public readonly trackingNumber: string,
    public readonly timestamp: string = new Date().toISOString()
  ) {}
}

/** @event */
export class ShipmentDispatched implements EventDef {
  readonly type = 'ShipmentDispatched'
  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly courierName: string,
    public readonly timestamp: string = new Date().toISOString()
  ) {}
}

/** @event */
export class ShipmentDelivered implements EventDef {
  readonly type = 'ShipmentDelivered'
  constructor(
    public readonly orderId: string,
    public readonly shipmentId: string,
    public readonly timestamp: string = new Date().toISOString()
  ) {}
}

export type ShipmentEvent =
  | ShipmentCreated
  | ShipmentDispatched
  | ShipmentDelivered

// External events (from other domains) - types only
export type OrderConfirmed = {
  type: 'OrderConfirmed'
  orderId: string
  timestamp: string
}

export type OrderCancelled = {
  type: 'OrderCancelled'
  orderId: string
  reason: string
  timestamp: string
}

export type ExternalEvent = OrderConfirmed | OrderCancelled

export const eventBus = new EventEmitter()

export function publishEvent(event: ShipmentEvent): void {
  eventBus.emit(event.type, event)
  console.log(`[Shipping] Published event: ${event.type}`, event)
}

export function subscribeToEvent<T extends ExternalEvent>(
  eventType: T['type'],
  handler: (event: T) => void | Promise<void>
): void {
  eventBus.on(eventType, handler)
  console.log(`[Shipping] Subscribed to event: ${eventType}`)
}
