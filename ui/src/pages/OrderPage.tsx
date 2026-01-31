import { Component } from 'react'

interface OrderPageState {
  customerId: string
  orderId: string
}

export class OrderPage extends Component<Record<string, never>, OrderPageState> {
  readonly route = '/order'

  override state: OrderPageState = {
    customerId: 'customer123',
    orderId: ''
  }

  handlePlaceOrder = async () => {
    const response = await fetch('http://localhost:3100/bff/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: this.state.customerId,
        items: [
          { sku: 'SKU001', quantity: 2 },
          { sku: 'SKU002', quantity: 1 }
        ],
        totalAmount: 150.00
      })
    })

    const data = await response.json()
    this.setState({ orderId: data.orderId })
  }

  override render() {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Place Order</h1>
        <div>
          <label>Customer ID:</label>
          <input
            value={this.state.customerId}
            onChange={(e) => this.setState({ customerId: e.target.value })}
          />
        </div>
        <button onClick={this.handlePlaceOrder}>Place Order</button>
        {this.state.orderId && <p>Order placed: {this.state.orderId}</p>}
      </div>
    )
  }
}
