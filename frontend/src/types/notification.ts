export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'report' | 'warning' | 'success' | 'admin' | 'assignment';
  read: boolean;
  createdAt: string;
  reportId?: string;
}
