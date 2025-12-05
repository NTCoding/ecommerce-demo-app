import { EventEmitter } from 'events';
export const eventBus = new EventEmitter();
export function subscribeToEvent(eventType, handler) {
    eventBus.on(eventType, handler);
    console.log(`[Notifications] Subscribed to event: ${eventType}`);
}
//# sourceMappingURL=events.js.map