export function placeOrderEndpoint(useCase) {
    return (req, res) => {
        const { customerId, items, totalAmount } = req.body;
        const order = useCase.apply({
            customerId,
            items,
            totalAmount
        });
        res.status(201).json({
            orderId: order.id,
            state: order.getState(),
            customerId: order.customerId,
            items: order.items
        });
    };
}
//# sourceMappingURL=endpoint.js.map