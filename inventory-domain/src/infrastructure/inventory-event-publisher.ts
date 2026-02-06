import { StockEventPublisher } from '../decorators'
import { eventBus, InventoryReserved } from './events'

@StockEventPublisher
export class InventoryEventPublisher {
  publishInventoryReserved(event: InventoryReserved): void {
    eventBus.emit(event.type, event)
    console.log(`[Inventory] Published event: ${event.type}`, event)
  }
}
