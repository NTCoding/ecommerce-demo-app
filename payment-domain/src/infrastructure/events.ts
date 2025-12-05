import { EventEmitter } from 'events'

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

export type PaymentRefunded = {
  type: 'PaymentRefunded'
  orderId: string
  paymentId: string
  amount: number
  timestamp: string
}

export type PaymentEvent = PaymentCompleted | PaymentFailed | PaymentRefunded

export type OrderPlaced = {
  type: 'OrderPlaced'
  orderId: string
  customerId: string
  items: Array<{ sku: string; quantity: number }>
  totalAmount: number
  timestamp: string
}

export type OrderCancelled = {
  type: 'OrderCancelled'
  orderId: string
  reason: string
  timestamp: string
}

export type ExternalEvent = OrderPlaced | OrderCancelled

export const eventBus = new EventEmitter()

export function publishEvent(event: PaymentEvent): void {
  eventBus.emit(event.type, event)
  console.log(`[Payment] Published event: ${event.type}`, event)
}

export function subscribeToEvent<T extends ExternalEvent>(
  eventType: T['type'],
  handler: (event: T) => void | Promise<void>
): void {
  eventBus.on(eventType, handler)
  console.log(`[Payment] Subscribed to event: ${eventType}`)
}
