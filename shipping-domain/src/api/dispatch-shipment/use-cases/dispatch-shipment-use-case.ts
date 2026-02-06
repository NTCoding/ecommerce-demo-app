import { Shipment } from '../../../domain/Shipment'
import { CourierApiClient } from '../../../infrastructure/courier-api-client'
import { ShipmentDispatched } from '../../../infrastructure/events'
import { ShippingEventPublisher } from '../../../infrastructure/shipping-event-publisher'

/** @useCase */
export class DispatchShipmentUseCase {
  constructor(
    private courierApi: CourierApiClient,
    private readonly publisher: ShippingEventPublisher
  ) {}

  async apply(shipmentId: string, shipment: Shipment): Promise<void> {
    if (!shipment.trackingNumber) {
      throw new Error('Shipment must have tracking number to dispatch')
    }

    await this.courierApi.dispatchShipment(shipment.trackingNumber)

    shipment.dispatch()

    this.publisher.publishShipmentDispatched(
      new ShipmentDispatched(shipmentId, shipment.orderId, 'FastCourier')
    )
  }
}
