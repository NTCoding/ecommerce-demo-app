import express from 'express'
import { InventoryItem } from './domain/InventoryItem'
import { CheckStockUseCase } from './api/check-stock/use-cases/check-stock-use-case'
import { checkStockEndpoint } from './api/check-stock/endpoint'
import { ReserveInventoryUseCase } from './consumer/order-placed/use-cases/reserve-inventory-use-case'
import { handleOrderPlaced } from './consumer/order-placed/handler'
import { ReleaseInventoryUseCase } from './consumer/order-cancelled/use-cases/release-inventory-use-case'
import { handleOrderCancelled } from './consumer/order-cancelled/handler'
import { subscribeToEvent, type OrderPlaced, type OrderCancelled } from './infrastructure/events'

const app = express()
const PORT = 3001

app.use(express.json())

const inventoryItems = new Map<string, InventoryItem>([
  ['SKU001', new InventoryItem('SKU001', 100, 0, 0)],
  ['SKU002', new InventoryItem('SKU002', 50, 0, 0)],
  ['SKU003', new InventoryItem('SKU003', 200, 0, 0)]
])

const checkStockUseCase = new CheckStockUseCase()
const reserveInventoryUseCase = new ReserveInventoryUseCase()
const releaseInventoryUseCase = new ReleaseInventoryUseCase()

app.get('/inventory/:sku', checkStockEndpoint(checkStockUseCase, inventoryItems))

subscribeToEvent<OrderPlaced>('OrderPlaced', (event) =>
  handleOrderPlaced(event, reserveInventoryUseCase, inventoryItems)
)

subscribeToEvent<OrderCancelled>('OrderCancelled', (event) =>
  handleOrderCancelled(event, releaseInventoryUseCase, inventoryItems)
)

app.listen(PORT, () => {
  console.log(`[Inventory Domain] Server running on http://localhost:${PORT}`)
})
