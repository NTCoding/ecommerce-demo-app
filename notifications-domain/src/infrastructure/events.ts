import { EventEmitter } from 'events'

export type OrderPlaced = {
  type: 'OrderPlaced'
  orderId: string
  customerId: string
  items: Array<{ sku: string; quantity: number }>
  totalAmount: number
  timestamp: string
}

export type PaymentCompleted = {
  type: 'PaymentCompleted'
  orderId: string
  paymentId: string
  amount: number
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
  | OrderPlaced
  | PaymentCompleted
  | ShipmentDispatched
  | ShipmentDelivered

export const eventBus = new EventEmitter()

export function subscribeToEvent(
  eventType: 'OrderPlaced',
  handler: (event: OrderPlaced) => void
): void
export function subscribeToEvent(
  eventType: 'PaymentCompleted',
  handler: (event: PaymentCompleted) => void
): void
export function subscribeToEvent(
  eventType: 'ShipmentDispatched',
  handler: (event: ShipmentDispatched) => void
): void
export function subscribeToEvent(
  eventType: 'ShipmentDelivered',
  handler: (event: ShipmentDelivered) => void
): void
export function subscribeToEvent(
  eventType: string,
  handler: (event: any) => void
): void {
  eventBus.on(eventType, handler)
  console.log(`[Notifications] Subscribed to event: ${eventType}`)
}
