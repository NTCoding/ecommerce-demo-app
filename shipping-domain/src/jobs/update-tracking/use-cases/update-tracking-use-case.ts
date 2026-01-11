import { Shipment } from '../../../domain/Shipment'
import { CourierApiClient } from '../../../infrastructure/courier-api-client'
import { publishEvent, type ShipmentDelivered } from '../../../infrastructure/events'

/** @riviere UseCase */
export class UpdateTrackingUseCase {
  constructor(private courierApi: CourierApiClient) {}

  async apply(shipments: Map<string, Shipment>): Promise<void> {
    for (const [shipmentId, shipment] of shipments.entries()) {
      if (!shipment.trackingNumber) {
        continue
      }

      const trackingStatus = await this.courierApi.getTrackingStatus(
        shipment.trackingNumber
      )

      console.log(
        `[Shipping Cron] Tracking status for ${shipment.trackingNumber}: ${trackingStatus.status}`
      )

      if (trackingStatus.status === 'in_transit' && shipment.getState() === 'Dispatched') {
        shipment.markInTransit()
      }

      if (trackingStatus.status === 'delivered' && shipment.getState() === 'InTransit') {
        shipment.deliver()

        const event: ShipmentDelivered = {
          type: 'ShipmentDelivered',
          orderId: shipment.orderId,
          shipmentId,
          timestamp: new Date().toISOString()
        }

        publishEvent(event)
      }
    }
  }
}
