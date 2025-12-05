import { EventEmitter } from 'events';
export const eventBus = new EventEmitter();
export function publishEvent(event) {
    eventBus.emit(event.type, event);
    console.log(`[Inventory] Published event: ${event.type}`, event);
}
export function subscribeToEvent(eventType, handler) {
    eventBus.on(eventType, handler);
    console.log(`[Inventory] Subscribed to event: ${eventType}`);
}
//# sourceMappingURL=events.js.map