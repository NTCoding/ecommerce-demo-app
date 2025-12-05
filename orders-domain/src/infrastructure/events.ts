import { EventEmitter } from 'events'

export type OrderPlaced = {
  type: 'OrderPlaced'
  orderId: string
  customerId: string
  items: Array<{ sku: string; quantity: number }>
  totalAmount: number
  timestamp: string
}

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

export type OrderEvent = OrderPlaced | OrderConfirmed | OrderCancelled

export type InventoryReserved = {
  type: 'InventoryReserved'
  orderId: string
  items: Array<{ sku: string; quantity: number }>
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
