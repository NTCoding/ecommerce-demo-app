import { EventEmitter } from 'events';
export const eventBus = new EventEmitter();
export function publishEvent(event) {
    eventBus.emit(event.type, event);
    console.log(`[Payment] Published event: ${event.type}`, event);
}
export function subscribeToEvent(eventType, handler) {
    eventBus.on(eventType, handler);
    console.log(`[Payment] Subscribed to event: ${eventType}`);
}
//# sourceMappingURL=events.js.map