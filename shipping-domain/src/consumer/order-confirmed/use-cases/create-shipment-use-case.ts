import { Shipment } from '../../../domain/Shipment'
import { CourierApiClient } from '../../../infrastructure/courier-api-client'
import { publishEvent, type ShipmentCreated } from '../../../infrastructure/events'

/** @useCase */
export class CreateShipmentUseCase {
  constructor(private courierApi: CourierApiClient) {}

  async apply(orderId: string, address: string): Promise<void> {
    const shipmentId = `ship_${Date.now()}`

    const courierResponse = await this.courierApi.createShipment({
      orderId,
      address,
      items: []
    })

    const shipment = new Shipment(
      shipmentId,
      orderId,
      address,
      courierResponse.trackingNumber
    )

    shipment.create(courierResponse.trackingNumber)

    const event: ShipmentCreated = {
      type: 'ShipmentCreated',
      orderId,
      shipmentId,
      trackingNumber: courierResponse.trackingNumber,
      timestamp: new Date().toISOString()
    }

    publishEvent(event)
  }
}
