import { Shipment } from '../../domain/Shipment';
export function dispatchShipmentEndpoint(useCase) {
    return (req, res) => {
        const shipmentId = req.params['shipmentId'];
        if (!shipmentId) {
            res.status(400).json({ error: 'Shipment ID is required' });
            return;
        }
        const shipment = new Shipment(shipmentId, 'order123', '123 Main St', 'TRK123');
        useCase.apply(shipmentId, shipment);
        res.status(200).json({
            shipmentId,
            state: shipment.getState(),
            message: 'Shipment dispatched successfully'
        });
    };
}
//# sourceMappingURL=endpoint.js.map