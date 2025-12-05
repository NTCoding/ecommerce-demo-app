import { EventEmitter } from 'events'

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

export type ShipmentEvent =
  | ShipmentCreated
  | ShipmentDispatched
  | ShipmentDelivered

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
