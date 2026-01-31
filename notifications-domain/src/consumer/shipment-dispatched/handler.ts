import type { EventHandlerDef } from '@living-architecture/riviere-extract-conventions'
import { BaseNotificationHandler } from '../../base-classes'
import type { ShipmentDispatched } from '../../infrastructure/events'
import { NotifyShipmentDispatchedUseCase } from './use-cases/notify-shipment-dispatched-use-case'

export class ShipmentDispatchedHandler extends BaseNotificationHandler<ShipmentDispatched> implements EventHandlerDef {
  readonly subscribedEvents = ['ShipmentDispatched']
  constructor(private readonly useCase: NotifyShipmentDispatchedUseCase) {
    super()
  }

  handle(event: ShipmentDispatched): void {
    console.log(`[Notifications] Handling ShipmentDispatched for shipment ${event.shipmentId}`)
    this.useCase.apply(event.orderId, event.shipmentId, event.courierName)
  }
}
