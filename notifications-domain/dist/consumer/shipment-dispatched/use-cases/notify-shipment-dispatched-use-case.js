import { Notification, NotificationType } from '../../../domain/Notification';
export class NotifyShipmentDispatchedUseCase {
    apply(orderId, shipmentId, courierName) {
        const notificationId = `notif_${Date.now()}`;
        const notification = new Notification(notificationId, 'customer123', NotificationType.Email, 'Your Order Has Been Shipped', `Your order ${orderId} has been dispatched via ${courierName}. Tracking: ${shipmentId}`);
        notification.markSent();
        console.log(`[Notifications] Sent shipping email for shipment ${shipmentId}`);
    }
}
//# sourceMappingURL=notify-shipment-dispatched-use-case.js.map