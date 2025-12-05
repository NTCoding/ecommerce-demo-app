import { Notification, NotificationType } from '../../../domain/Notification';
export class NotifyOrderPlacedUseCase {
    apply(orderId, customerId) {
        const notificationId = `notif_${Date.now()}`;
        const notification = new Notification(notificationId, customerId, NotificationType.Email, 'Order Placed Successfully', `Your order ${orderId} has been placed successfully.`);
        notification.markSent();
        console.log(`[Notifications] Sent email notification for order ${orderId}`);
    }
}
//# sourceMappingURL=notify-order-placed-use-case.js.map