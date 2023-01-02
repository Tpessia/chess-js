export interface NotificationItem {
    id: number;
    type: NotificationType,
    message: string;
    date: Date;
}

export enum NotificationType {
    Info = 'Info',
    Warning = 'Warning',
    Error = 'Error'
}
