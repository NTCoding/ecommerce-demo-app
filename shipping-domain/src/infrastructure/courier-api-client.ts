export type CourierShipmentRequest = {
  orderId: string
  address: string
  items: Array<{ sku: string; quantity: number }>
}

export type CourierShipmentResponse = {
  shipmentId: string
  trackingNumber: string
  estimatedDelivery: string
}

export type TrackingStatus = {
  trackingNumber: string
  status: 'created' | 'dispatched' | 'in_transit' | 'delivered'
  lastUpdate: string
  location?: string
}

export class CourierApiClient {
  async createShipment(
    request: CourierShipmentRequest
  ): Promise<CourierShipmentResponse> {
    console.log(
      `[CourierApiClient] Creating shipment for order ${request.orderId}`
    )

    const trackingNumber = `TRK${Date.now()}`
    const estimatedDelivery = new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ).toISOString()

    return {
      shipmentId: `ship_${Date.now()}`,
      trackingNumber,
      estimatedDelivery
    }
  }

  async dispatchShipment(trackingNumber: string): Promise<void> {
    console.log(`[CourierApiClient] Dispatching shipment: ${trackingNumber}`)
  }

  async getTrackingStatus(trackingNumber: string): Promise<TrackingStatus> {
    console.log(
      `[CourierApiClient] Getting tracking status for: ${trackingNumber}`
    )

    const statuses: TrackingStatus['status'][] = [
      'created',
      'dispatched',
      'in_transit',
      'delivered'
    ]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    if (randomStatus === undefined) {
      throw new Error('Failed to get random status')
    }

    return {
      trackingNumber,
      status: randomStatus,
      lastUpdate: new Date().toISOString(),
      location: 'Distribution Center'
    }
  }
}
