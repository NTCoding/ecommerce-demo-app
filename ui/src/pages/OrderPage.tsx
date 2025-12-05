import { useState } from 'react'

export function OrderPage() {
  const [customerId, setCustomerId] = useState('customer123')
  const [orderId, setOrderId] = useState('')

  const handlePlaceOrder = async () => {
    const response = await fetch('http://localhost:3100/bff/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        items: [
          { sku: 'SKU001', quantity: 2 },
          { sku: 'SKU002', quantity: 1 }
        ],
        totalAmount: 150.00
      })
    })

    const data = await response.json()
    setOrderId(data.orderId)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Place Order</h1>
      <div>
        <label>Customer ID:</label>
        <input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
      </div>
      <button onClick={handlePlaceOrder}>Place Order</button>
      {orderId && <p>Order placed: {orderId}</p>}
    </div>
  )
}
