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
  private readonly fedexShippingApiUrl = 'https://apis.fedex.com/ship/v1/shipments'
  private readonly fedexTrackingApiUrl = 'https://apis.fedex.com/track/v1/trackingnumbers'

  async createShipment(
    request: CourierShipmentRequest
  ): Promise<CourierShipmentResponse> {
    const response = await fetch(this.fedexShippingApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FEDEX_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shipToAddress: request.address,
        orderId: request.orderId,
        packages: request.items
      })
    })

    const data = await response.json()

    return {
      shipmentId: data.output.transactionShipments[0].shipmentId,
      trackingNumber: data.output.transactionShipments[0].masterTrackingNumber,
      estimatedDelivery: data.output.transactionShipments[0].estimatedDeliveryDate
    }
  }

  async dispatchShipment(trackingNumber: string): Promise<void> {
    await fetch(`${this.fedexShippingApiUrl}/${trackingNumber}/dispatch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FEDEX_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
  }

  async getTrackingStatus(trackingNumber: string): Promise<TrackingStatus> {
    const response = await fetch(this.fedexTrackingApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FEDEX_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trackingInfo: [{ trackingNumberInfo: { trackingNumber } }]
      })
    })

    const data = await response.json()
    const trackResult = data.output.completeTrackResults[0].trackResults[0]

    const statusMap: Record<string, TrackingStatus['status']> = {
      'PU': 'created',
      'DP': 'dispatched',
      'IT': 'in_transit',
      'DL': 'delivered'
    }

    return {
      trackingNumber,
      status: statusMap[trackResult.latestStatusDetail.code] ?? 'created',
      lastUpdate: trackResult.latestStatusDetail.scanDateTime,
      location: trackResult.latestStatusDetail.scanLocation?.city
    }
  }
}
