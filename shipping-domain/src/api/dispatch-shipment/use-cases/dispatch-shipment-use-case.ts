import { Shipment } from '../../../domain/Shipment'
import { CourierApiClient } from '../../../infrastructure/courier-api-client'
import { publishEvent, type ShipmentDispatched } from '../../../infrastructure/events'

/** @useCase */
export class DispatchShipmentUseCase {
  constructor(private courierApi: CourierApiClient) {}

  async apply(shipmentId: string, shipment: Shipment): Promise<void> {
    if (!shipment.trackingNumber) {
      throw new Error('Shipment must have tracking number to dispatch')
    }

    await this.courierApi.dispatchShipment(shipment.trackingNumber)

    shipment.dispatch()

    const event: ShipmentDispatched = {
      type: 'ShipmentDispatched',
      shipmentId,
      orderId: shipment.orderId,
      courierName: 'FastCourier',
      timestamp: new Date().toISOString()
    }

    publishEvent(event)
  }
}
