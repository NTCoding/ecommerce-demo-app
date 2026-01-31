import { BaseNotificationUseCase } from '../../../base-classes'
import { Notification, NotificationType } from '../../../domain/Notification'

async function sendEmailViaSendGrid(
  recipient: string,
  subject: string,
  message: string
): Promise<void> {
  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env['SENDGRID_API_KEY']}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: recipient }] }],
      from: { email: 'noreply@example.test' },
      subject,
      content: [{ type: 'text/plain', value: message }]
    })
  })
}

export class NotifyOrderPlacedUseCase extends BaseNotificationUseCase {
  async apply(orderId: string, customerId: string): Promise<void> {
    const notificationId = `notif_${Date.now()}`

    const notification = new Notification(
      notificationId,
      customerId,
      NotificationType.Email,
      'Order Placed Successfully',
      `Your order ${orderId} has been placed successfully.`
    )

    await sendEmailViaSendGrid(
      customerId,
      notification.subject,
      notification.message
    )

    notification.markSent()

    console.log(`[Notifications] Sent email notification for order ${orderId}`)
  }
}
