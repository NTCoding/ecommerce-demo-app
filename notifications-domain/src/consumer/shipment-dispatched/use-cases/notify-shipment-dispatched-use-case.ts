import { BaseNotificationUseCase } from '../../../base-classes'
import { Notification, NotificationType } from '../../../domain/Notification'

export class NotifyShipmentDispatchedUseCase extends BaseNotificationUseCase {
  apply(orderId: string, shipmentId: string, courierName: string): void {
    const notificationId = `notif_${Date.now()}`

    const notification = new Notification(
      notificationId,
      'customer123',
      NotificationType.Email,
      'Your Order Has Been Shipped',
      `Your order ${orderId} has been dispatched via ${courierName}. Tracking: ${shipmentId}`
    )

    notification.markSent()

    console.log(
      `[Notifications] Sent shipping email for shipment ${shipmentId}`
    )
  }
}
