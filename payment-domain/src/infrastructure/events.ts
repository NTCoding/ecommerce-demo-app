import type { EventDef } from '@living-architecture/riviere-extract-conventions'
import { EventEmitter } from 'events'
import { IPaymentEvent } from '../interfaces'

export class PaymentCompleted implements IPaymentEvent, EventDef {
  readonly type = 'PaymentCompleted'
  constructor(
    public readonly orderId: string,
    public readonly paymentId: string,
    public readonly amount: number,
    public readonly timestamp: string = new Date().toISOString()
  ) {}
}

export class PaymentFailed implements IPaymentEvent, EventDef {
  readonly type = 'PaymentFailed'
  constructor(
    public readonly orderId: string,
    public readonly paymentId: string,
    public readonly reason: string,
    public readonly timestamp: string = new Date().toISOString()
  ) {}
}

export class PaymentRefunded implements IPaymentEvent, EventDef {
  readonly type = 'PaymentRefunded'
  constructor(
    public readonly orderId: string,
    public readonly paymentId: string,
    public readonly amount: number,
    public readonly timestamp: string = new Date().toISOString()
  ) {}
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
