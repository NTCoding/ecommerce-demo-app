import { BaseNotificationHandler } from '../../base-classes'
import type { ShipmentDelivered } from '../../infrastructure/events'
import { NotifyShipmentDeliveredUseCase } from './use-cases/notify-shipment-delivered-use-case'

export class ShipmentDeliveredHandler extends BaseNotificationHandler<ShipmentDelivered> {
  constructor(private readonly useCase: NotifyShipmentDeliveredUseCase) {
    super()
  }

  handle(event: ShipmentDelivered): void {
    console.log(`[Notifications] Handling ShipmentDelivered for shipment ${event.shipmentId}`)
    this.useCase.apply(event.orderId, event.shipmentId)
  }
}
