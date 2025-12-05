export var NotificationType;
(function (NotificationType) {
    NotificationType["Email"] = "Email";
    NotificationType["SMS"] = "SMS";
    NotificationType["Push"] = "Push";
})(NotificationType || (NotificationType = {}));
export var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["Pending"] = "Pending";
    NotificationStatus["Sent"] = "Sent";
    NotificationStatus["Failed"] = "Failed";
})(NotificationStatus || (NotificationStatus = {}));
export class Notification {
    id;
    recipient;
    type;
    subject;
    message;
    status = NotificationStatus.Pending;
    constructor(id, recipient, type, subject, message) {
        this.id = id;
        this.recipient = recipient;
        this.type = type;
        this.subject = subject;
        this.message = message;
    }
    markSent() {
        this.status = NotificationStatus.Sent;
    }
    markFailed() {
        this.status = NotificationStatus.Failed;
    }
    getStatus() {
        return this.status;
    }
}
//# sourceMappingURL=Notification.js.map