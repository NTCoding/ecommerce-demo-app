export declare enum NotificationType {
    Email = "Email",
    SMS = "SMS",
    Push = "Push"
}
export declare enum NotificationStatus {
    Pending = "Pending",
    Sent = "Sent",
    Failed = "Failed"
}
export declare class Notification {
    readonly id: string;
    readonly recipient: string;
    readonly type: NotificationType;
    readonly subject: string;
    readonly message: string;
    private status;
    constructor(id: string, recipient: string, type: NotificationType, subject: string, message: string);
    markSent(): void;
    markFailed(): void;
    getStatus(): NotificationStatus;
}
//# sourceMappingURL=Notification.d.ts.map