import { EventPublisherContainer } from '@living-architecture/riviere-extract-conventions-published-language'
import { eventBus, OrderPlaced, OrderConfirmed, OrderCancelled } from './events'

@EventPublisherContainer
export class OrderEventPublisher {

  publishOrderPlaced(event: OrderPlaced): void {
    eventBus.emit(event.type, event)
    console.log(`[Orders] Published event: ${event.type}`, event)
  }

  publishOrderConfirmed(event: OrderConfirmed): void {
    eventBus.emit(event.type, event)
    console.log(`[Orders] Published event: ${event.type}`, event)
  }

  publishOrderCancelled(event: OrderCancelled): void {
    eventBus.emit(event.type, event)
    console.log(`[Orders] Published event: ${event.type}`, event)
  }
}
