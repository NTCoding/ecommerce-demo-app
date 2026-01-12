import { BaseNotificationUseCase } from '../../../base-classes'
import { Notification, NotificationType } from '../../../domain/Notification'

export class NotifyShipmentDeliveredUseCase extends BaseNotificationUseCase {
  apply(orderId: string, shipmentId: string): void {
    const notificationId = `notif_${Date.now()}`

    const notification = new Notification(
      notificationId,
      'customer123',
      NotificationType.Email,
      'Your Order Has Been Delivered',
      `Your order ${orderId} has been successfully delivered. Thank you for your purchase!`
    )

    notification.markSent()

    console.log(
      `[Notifications] Sent delivery confirmation for shipment ${shipmentId}`
    )
  }
}
