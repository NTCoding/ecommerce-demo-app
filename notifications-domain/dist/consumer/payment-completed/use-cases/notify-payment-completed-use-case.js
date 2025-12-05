import { Notification, NotificationType } from '../../../domain/Notification';
export class NotifyPaymentCompletedUseCase {
    apply(orderId, paymentId, amount) {
        const notificationId = `notif_${Date.now()}`;
        const notification = new Notification(notificationId, 'customer123', NotificationType.SMS, 'Payment Successful', `Payment of $${amount} for order ${orderId} completed successfully.`);
        notification.markSent();
        console.log(`[Notifications] Sent SMS notification for payment ${paymentId}`);
    }
}
//# sourceMappingURL=notify-payment-completed-use-case.js.map