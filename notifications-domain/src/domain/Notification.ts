export enum NotificationType {
  Email = 'Email',
  SMS = 'SMS',
  Push = 'Push'
}

export enum NotificationStatus {
  Pending = 'Pending',
  Sent = 'Sent',
  Failed = 'Failed'
}

export class Notification {
  private status: NotificationStatus = NotificationStatus.Pending

  constructor(
    public readonly id: string,
    public readonly recipient: string,
    public readonly type: NotificationType,
    public readonly subject: string,
    public readonly message: string
  ) {}

  markSent(): void {
    if (this.status !== NotificationStatus.Pending) {
      throw new Error('Notification must be in Pending status to mark as sent')
    }
    this.status = NotificationStatus.Sent
  }

  markFailed(): void {
    if (this.status !== NotificationStatus.Pending) {
      throw new Error('Notification must be in Pending status to mark as failed')
    }
    this.status = NotificationStatus.Failed
  }

  getStatus(): NotificationStatus {
    return this.status
  }
}
