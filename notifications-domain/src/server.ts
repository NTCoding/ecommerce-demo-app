import express from 'express'
import { NotifyOrderPlacedUseCase } from './consumer/order-placed/use-cases/notify-order-placed-use-case'
import { handleOrderPlaced } from './consumer/order-placed/handler'
import { NotifyPaymentCompletedUseCase } from './consumer/payment-completed/use-cases/notify-payment-completed-use-case'
import { handlePaymentCompleted } from './consumer/payment-completed/handler'
import { NotifyShipmentDispatchedUseCase } from './consumer/shipment-dispatched/use-cases/notify-shipment-dispatched-use-case'
import { handleShipmentDispatched } from './consumer/shipment-dispatched/handler'
import { NotifyShipmentDeliveredUseCase } from './consumer/shipment-delivered/use-cases/notify-shipment-delivered-use-case'
import { handleShipmentDelivered } from './consumer/shipment-delivered/handler'
import { subscribeToEvent } from './infrastructure/events'

const app = express()
const PORT = 3004

app.use(express.json())

const notifyOrderPlacedUseCase = new NotifyOrderPlacedUseCase()
const notifyPaymentCompletedUseCase = new NotifyPaymentCompletedUseCase()
const notifyShipmentDispatchedUseCase = new NotifyShipmentDispatchedUseCase()
const notifyShipmentDeliveredUseCase = new NotifyShipmentDeliveredUseCase()

subscribeToEvent('OrderPlaced', (event) =>
  handleOrderPlaced(event, notifyOrderPlacedUseCase)
)

subscribeToEvent('PaymentCompleted', (event) =>
  handlePaymentCompleted(event, notifyPaymentCompletedUseCase)
)

subscribeToEvent('ShipmentDispatched', (event) =>
  handleShipmentDispatched(event, notifyShipmentDispatchedUseCase)
)

subscribeToEvent('ShipmentDelivered', (event) =>
  handleShipmentDelivered(event, notifyShipmentDeliveredUseCase)
)

app.listen(PORT, () => {
  console.log(
    `[Notifications Domain] Server running on http://localhost:${PORT}`
  )
})
