export type PlaceOrderBFFRequest = {
  customerId: string
  items: Array<{ sku: string; quantity: number }>
  totalAmount: number
}

export type PlaceOrderBFFResponse = {
  orderId: string
  state: string
  inventoryStatus: string
  paymentStatus: string
}

export class PlaceOrderBFFUseCase {
  async apply(request: PlaceOrderBFFRequest): Promise<PlaceOrderBFFResponse> {
    const orderResponse = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    const orderData = await orderResponse.json()

    const inventoryChecks = await Promise.all(
      request.items.map((item) =>
        fetch(`http://localhost:3001/inventory/${item.sku}`)
      )
    )

    return {
      orderId: orderData.orderId,
      state: orderData.state,
      inventoryStatus: 'checked',
      paymentStatus: 'pending'
    }
  }
}
