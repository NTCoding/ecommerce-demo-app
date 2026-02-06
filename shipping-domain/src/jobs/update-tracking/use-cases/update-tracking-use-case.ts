import { Shipment } from '../../../domain/Shipment'
import { CourierApiClient } from '../../../infrastructure/courier-api-client'
import { ShipmentDelivered } from '../../../infrastructure/events'
import { ShippingEventPublisher } from '../../../infrastructure/shipping-event-publisher'

/** @useCase */
export class UpdateTrackingUseCase {
  constructor(
    private courierApi: CourierApiClient,
    private readonly publisher: ShippingEventPublisher
  ) {}

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

        this.publisher.publishShipmentDelivered(
          new ShipmentDelivered(shipment.orderId, shipmentId)
        )
      }
    }
  }
}
