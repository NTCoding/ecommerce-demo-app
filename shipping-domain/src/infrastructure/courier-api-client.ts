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

type FedexShipmentResponse = {
  output: {
    transactionShipments: Array<{
      shipmentId: string
      masterTrackingNumber: string
      estimatedDeliveryDate: string
    }>
  }
}

type FedexTrackingResponse = {
  output: {
    completeTrackResults: Array<{
      trackResults: Array<{
        latestStatusDetail: {
          code: string
          scanDateTime: string
          scanLocation?: { city: string }
        }
      }>
    }>
  }
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
        'Authorization': `Bearer ${process.env['FEDEX_API_KEY']}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shipToAddress: request.address,
        orderId: request.orderId,
        packages: request.items
      })
    })

    const data = await response.json() as FedexShipmentResponse
    const shipment = data.output.transactionShipments[0]
    if (!shipment) {
      throw new Error('No shipment returned from FedEx API')
    }

    return {
      shipmentId: shipment.shipmentId,
      trackingNumber: shipment.masterTrackingNumber,
      estimatedDelivery: shipment.estimatedDeliveryDate
    }
  }

  async dispatchShipment(trackingNumber: string): Promise<void> {
    await fetch(`${this.fedexShippingApiUrl}/${trackingNumber}/dispatch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env['FEDEX_API_KEY']}`,
        'Content-Type': 'application/json'
      }
    })
  }

  async getTrackingStatus(trackingNumber: string): Promise<TrackingStatus> {
    const response = await fetch(this.fedexTrackingApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env['FEDEX_API_KEY']}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trackingInfo: [{ trackingNumberInfo: { trackingNumber } }]
      })
    })

    const data = await response.json() as FedexTrackingResponse
    const trackResult = data.output.completeTrackResults[0]?.trackResults[0]
    if (!trackResult) {
      throw new Error('No tracking result returned from FedEx API')
    }

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
      ...(trackResult.latestStatusDetail.scanLocation?.city && {
        location: trackResult.latestStatusDetail.scanLocation.city
      })
    }
  }
}
