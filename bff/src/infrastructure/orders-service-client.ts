/** @httpClient */
export class OrdersServiceClient {
  readonly serviceName = 'orders'
  readonly route = '/orders'

  async placeOrder(request: {
    customerId: string
    items: Array<{ sku: string; quantity: number }>
    totalAmount: number
    paymentMethodId: string
  }): Promise<{ orderId: string; state: string }> {
    const response = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    return (await response.json()) as { orderId: string; state: string }
  }
}
