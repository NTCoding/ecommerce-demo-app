import { BaseNotificationUseCase } from '../../../base-classes'
import { Notification, NotificationType } from '../../../domain/Notification'

export class NotifyPaymentCompletedUseCase extends BaseNotificationUseCase {
  apply(orderId: string, paymentId: string, amount: number): void {
    const notificationId = `notif_${Date.now()}`

    const notification = new Notification(
      notificationId,
      'customer123',
      NotificationType.SMS,
      'Payment Successful',
      `Payment of $${amount} for order ${orderId} completed successfully.`
    )

    notification.markSent()

    console.log(`[Notifications] Sent SMS notification for payment ${paymentId}`)
  }
}
