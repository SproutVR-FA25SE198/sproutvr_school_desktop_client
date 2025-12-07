interface NotificationSeverity {
  value: string;
  label: string;
}

export const NotificationSeverity = [
  { value: 'INFO', label: 'Thông tin' },
  { value: 'WARNING', label: 'Cảnh báo' },
] as NotificationSeverity[];
