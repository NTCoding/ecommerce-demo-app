import type { ShipmentDispatched } from '../../infrastructure/events'
import { NotifyShipmentDispatchedUseCase } from './use-cases/notify-shipment-dispatched-use-case'

export function handleShipmentDispatched(
  event: ShipmentDispatched,
  useCase: NotifyShipmentDispatchedUseCase
): void {
  console.log(
    `[Notifications] Handling ShipmentDispatched for shipment ${event.shipmentId}`
  )

  useCase.apply(event.orderId, event.shipmentId, event.courierName)
}
