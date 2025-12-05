export function handleShipmentDispatched(event, useCase) {
    console.log(`[Notifications] Handling ShipmentDispatched for shipment ${event.shipmentId}`);
    useCase.apply(event.orderId, event.shipmentId, event.courierName);
}
//# sourceMappingURL=handler.js.map