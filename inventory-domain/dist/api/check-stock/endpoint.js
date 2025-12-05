export function checkStockEndpoint(useCase, inventoryItems) {
    return (req, res) => {
        const sku = req.params['sku'];
        if (!sku) {
            res.status(400).json({ error: 'SKU is required' });
            return;
        }
        try {
            const stockInfo = useCase.apply(sku, inventoryItems);
            res.status(200).json(stockInfo);
        }
        catch (error) {
            res.status(404).json({
                error: error instanceof Error ? error.message : 'SKU not found'
            });
        }
    };
}
//# sourceMappingURL=endpoint.js.map