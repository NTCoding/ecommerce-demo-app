import type { ShipmentDelivered } from '../../infrastructure/events'
import { NotifyShipmentDeliveredUseCase } from './use-cases/notify-shipment-delivered-use-case'

export function handleShipmentDelivered(
  event: ShipmentDelivered,
  useCase: NotifyShipmentDeliveredUseCase
): void {
  console.log(
    `[Notifications] Handling ShipmentDelivered for shipment ${event.shipmentId}`
  )

  useCase.apply(event.orderId, event.shipmentId)
}
