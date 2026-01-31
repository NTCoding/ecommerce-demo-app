import express from 'express'
import { NotifyOrderPlacedUseCase } from './consumer/order-placed/use-cases/notify-order-placed-use-case'
import { OrderPlacedHandler } from './consumer/order-placed/handler'
import { NotifyPaymentCompletedUseCase } from './consumer/payment-completed/use-cases/notify-payment-completed-use-case'
import { PaymentCompletedHandler } from './consumer/payment-completed/handler'
import { NotifyShipmentDispatchedUseCase } from './consumer/shipment-dispatched/use-cases/notify-shipment-dispatched-use-case'
import { ShipmentDispatchedHandler } from './consumer/shipment-dispatched/handler'
import { NotifyShipmentDeliveredUseCase } from './consumer/shipment-delivered/use-cases/notify-shipment-delivered-use-case'
import { ShipmentDeliveredHandler } from './consumer/shipment-delivered/handler'
import { subscribeToEvent } from './infrastructure/events'

const app = express()
const PORT = 3004

app.use(express.json())

const orderPlacedHandler = new OrderPlacedHandler(new NotifyOrderPlacedUseCase())
const paymentCompletedHandler = new PaymentCompletedHandler(new NotifyPaymentCompletedUseCase())
const shipmentDispatchedHandler = new ShipmentDispatchedHandler(new NotifyShipmentDispatchedUseCase())
const shipmentDeliveredHandler = new ShipmentDeliveredHandler(new NotifyShipmentDeliveredUseCase())

subscribeToEvent('OrderPlaced', (event) =>
  orderPlacedHandler.handle(event)
)

subscribeToEvent('PaymentCompleted', (event) =>
  paymentCompletedHandler.handle(event)
)

subscribeToEvent('ShipmentDispatched', (event) =>
  shipmentDispatchedHandler.handle(event)
)

subscribeToEvent('ShipmentDelivered', (event) =>
  shipmentDeliveredHandler.handle(event)
)

app.listen(PORT, () => {
  console.log(
    `[Notifications Domain] Server running on http://localhost:${PORT}`
  )
})
