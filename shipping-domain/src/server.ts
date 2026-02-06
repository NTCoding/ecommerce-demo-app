import express from 'express'
import { CourierApiClient } from './infrastructure/courier-api-client'
import { ShippingEventPublisher } from './infrastructure/shipping-event-publisher'
import { CreateShipmentUseCase } from './consumer/order-confirmed/use-cases/create-shipment-use-case'
import { handleOrderConfirmed } from './consumer/order-confirmed/handler'
import { DispatchShipmentUseCase } from './api/dispatch-shipment/use-cases/dispatch-shipment-use-case'
import { dispatchShipmentEndpoint } from './api/dispatch-shipment/endpoint'
import { subscribeToEvent } from './infrastructure/events'
import type { OrderConfirmed } from './infrastructure/events'

const app = express()
const PORT = 3002

app.use(express.json())

const courierApi = new CourierApiClient()
const publisher = new ShippingEventPublisher()
const createShipmentUseCase = new CreateShipmentUseCase(courierApi, publisher)
const dispatchShipmentUseCase = new DispatchShipmentUseCase(courierApi, publisher)

app.put('/shipments/:shipmentId/dispatch', dispatchShipmentEndpoint(dispatchShipmentUseCase))

subscribeToEvent<OrderConfirmed>('OrderConfirmed', (event) =>
  handleOrderConfirmed(event, createShipmentUseCase)
)

app.listen(PORT, () => {
  console.log(`[Shipping Domain] Server running on http://localhost:${PORT}`)
})
