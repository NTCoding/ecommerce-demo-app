import express from 'express'
import { PlaceOrderUseCase } from './api/place-order/use-cases/place-order-use-case'
import { placeOrderEndpoint } from './api/place-order/endpoint'
import { CancelOrderUseCase } from './api/cancel-order/use-cases/cancel-order-use-case'
import { cancelOrderEndpoint } from './api/cancel-order/endpoint'
import { ConfirmOrderAfterInventoryUseCase } from './consumer/inventory-reserved/use-cases/confirm-order-after-inventory-use-case'
import { handleInventoryReserved } from './consumer/inventory-reserved/handler'
import { ConfirmOrderAfterPaymentUseCase } from './consumer/payment-completed/use-cases/confirm-order-after-payment-use-case'
import { handlePaymentCompleted } from './consumer/payment-completed/handler'
import { CompleteOrderUseCase } from './consumer/shipment-delivered/use-cases/complete-order-use-case'
import { handleShipmentDelivered } from './consumer/shipment-delivered/handler'
import { subscribeToEvent, type InventoryReserved, type PaymentCompleted, type ShipmentDelivered } from './infrastructure/events'

const app = express()
const PORT = 3000

app.use(express.json())

const placeOrderUseCase = new PlaceOrderUseCase()
const cancelOrderUseCase = new CancelOrderUseCase()
const confirmAfterInventoryUseCase = new ConfirmOrderAfterInventoryUseCase()
const confirmAfterPaymentUseCase = new ConfirmOrderAfterPaymentUseCase()
const completeOrderUseCase = new CompleteOrderUseCase()

app.post('/orders', placeOrderEndpoint(placeOrderUseCase))
app.delete('/orders/:orderId', cancelOrderEndpoint(cancelOrderUseCase))

subscribeToEvent<InventoryReserved>('InventoryReserved', (event) =>
  handleInventoryReserved(event, confirmAfterInventoryUseCase)
)

subscribeToEvent<PaymentCompleted>('PaymentCompleted', (event) =>
  handlePaymentCompleted(event, confirmAfterPaymentUseCase)
)

subscribeToEvent<ShipmentDelivered>('ShipmentDelivered', (event) =>
  handleShipmentDelivered(event, completeOrderUseCase)
)

app.listen(PORT, () => {
  console.log(`[Orders Domain] Server running on http://localhost:${PORT}`)
})
