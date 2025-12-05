import { EventEmitter } from 'events'

export type InventoryReserved = {
  type: 'InventoryReserved'
  orderId: string
  items: Array<{ sku: string; quantity: number }>
  timestamp: string
}

export type InventoryEvent = InventoryReserved

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

export type ShipmentCreated = {
  type: 'ShipmentCreated'
  orderId: string
  shipmentId: string
  trackingNumber: string
  timestamp: string
}

export type ExternalEvent = OrderPlaced | OrderCancelled | ShipmentCreated

export const eventBus = new EventEmitter()

export function publishEvent(event: InventoryEvent): void {
  eventBus.emit(event.type, event)
  console.log(`[Inventory] Published event: ${event.type}`, event)
}

export function subscribeToEvent<T extends ExternalEvent>(
  eventType: T['type'],
  handler: (event: T) => void | Promise<void>
): void {
  eventBus.on(eventType, handler)
  console.log(`[Inventory] Subscribed to event: ${eventType}`)
}
