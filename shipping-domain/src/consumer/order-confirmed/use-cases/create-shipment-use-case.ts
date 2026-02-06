import { Shipment } from '../../../domain/Shipment'
import { CourierApiClient } from '../../../infrastructure/courier-api-client'
import { ShipmentCreated } from '../../../infrastructure/events'
import { ShippingEventPublisher } from '../../../infrastructure/shipping-event-publisher'

/** @useCase */
export class CreateShipmentUseCase {
  constructor(
    private courierApi: CourierApiClient,
    private readonly publisher: ShippingEventPublisher
  ) {}

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

    this.publisher.publishShipmentCreated(
      new ShipmentCreated(orderId, shipmentId, courierResponse.trackingNumber)
    )
  }
}
