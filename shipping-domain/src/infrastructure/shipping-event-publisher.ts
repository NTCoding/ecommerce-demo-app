import { eventBus, ShipmentCreated, ShipmentDispatched, ShipmentDelivered } from './events'

/** @eventPublisher */
export class ShippingEventPublisher {
  publishShipmentCreated(event: ShipmentCreated): void {
    eventBus.emit(event.type, event)
    console.log(`[Shipping] Published event: ${event.type}`, event)
  }

  publishShipmentDispatched(event: ShipmentDispatched): void {
    eventBus.emit(event.type, event)
    console.log(`[Shipping] Published event: ${event.type}`, event)
  }

  publishShipmentDelivered(event: ShipmentDelivered): void {
    eventBus.emit(event.type, event)
    console.log(`[Shipping] Published event: ${event.type}`, event)
  }
}
