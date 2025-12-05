export function handleShipmentDelivered(event, useCase) {
    console.log(`[Notifications] Handling ShipmentDelivered for shipment ${event.shipmentId}`);
    useCase.apply(event.orderId, event.shipmentId);
}
//# sourceMappingURL=handler.js.map