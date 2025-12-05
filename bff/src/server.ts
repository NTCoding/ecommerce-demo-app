import express from 'express'
import { PlaceOrderBFFUseCase } from './api/place-order/use-cases/place-order-bff-use-case'
import { placeOrderBFFEndpoint } from './api/place-order/endpoint'

const app = express()
const PORT = 3100

app.use(express.json())

const placeOrderUseCase = new PlaceOrderBFFUseCase()

app.post('/bff/orders', placeOrderBFFEndpoint(placeOrderUseCase))

app.listen(PORT, () => {
  console.log(`[BFF] Server running on http://localhost:${PORT}`)
})
