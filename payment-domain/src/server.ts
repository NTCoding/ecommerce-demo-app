import express from 'express'
import { PaymentGatewayClient } from './infrastructure/payment-gateway-client'
import { ProcessPaymentUseCase } from './consumer/order-placed/use-cases/process-payment-use-case'
import { handleOrderPlaced } from './consumer/order-placed/handler'
import { subscribeToEvent } from './infrastructure/events'
import type { OrderPlaced } from './infrastructure/events'

const app = express()
const PORT = 3003

app.use(express.json())

const paymentGateway = new PaymentGatewayClient()
const processPaymentUseCase = new ProcessPaymentUseCase(paymentGateway)

subscribeToEvent<OrderPlaced>('OrderPlaced', (event) =>
  handleOrderPlaced(event, processPaymentUseCase)
)

app.listen(PORT, () => {
  console.log(`[Payment Domain] Server running on http://localhost:${PORT}`)
})
