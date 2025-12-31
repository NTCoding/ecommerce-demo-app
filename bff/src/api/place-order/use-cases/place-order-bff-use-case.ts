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

async function checkFraudDetection(customerId: string, totalAmount: number): Promise<boolean> {
  const response = await fetch('http://fraud-detection-service.internal/api/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, totalAmount })
  })
  const data = await response.json()
  return data.approved
}

async function fetchCustomerProfile(customerId: string): Promise<{ paymentMethodId: string }> {
  const response = await fetch(`http://customer-service.internal/api/customers/${customerId}/profile`)
  return response.json()
}

export class PlaceOrderBFFUseCase {
  async apply(request: PlaceOrderBFFRequest): Promise<PlaceOrderBFFResponse> {
    const fraudCheckPassed = await checkFraudDetection(request.customerId, request.totalAmount)
    if (!fraudCheckPassed) {
      throw new Error('Order rejected due to fraud detection')
    }

    const customerProfile = await fetchCustomerProfile(request.customerId)

    const orderResponse = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...request,
        paymentMethodId: customerProfile.paymentMethodId
      })
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
