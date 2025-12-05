import { Order } from '../../domain/Order';
export function cancelOrderEndpoint(useCase) {
    return (req, res) => {
        const orderId = req.params['orderId'];
        const { reason } = req.body;
        if (!orderId) {
            res.status(400).json({ error: 'Order ID is required' });
            return;
        }
        const order = new Order(orderId, 'customer123', []);
        useCase.apply({ orderId, reason }, order);
        res.status(200).json({
            orderId,
            state: order.getState(),
            message: 'Order cancelled successfully'
        });
    };
}
//# sourceMappingURL=endpoint.js.map