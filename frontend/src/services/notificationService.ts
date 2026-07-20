import type { Notification } from '../types/notification';

const STORAGE_KEY = 'saferoad_notifications';

const getPastDateString = (offsetMs: number): string => {
  return new Date(Date.now() - offsetMs).toISOString();
};

const INITIAL_MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Report Verified',
    message: 'Your pothole report #PR-9034 has been verified by the municipal team.',
    type: 'success',
    read: false,
    createdAt: getPastDateString(5 * 60 * 1000), // 5 min ago
    reportId: 'PR-9034',
  },
  {
    id: 'notif-2',
    title: 'New Hazard Nearby',
    message: 'A severe road hazard (deep pothole) was reported 500m from your current location.',
    type: 'warning',
    read: false,
    createdAt: getPastDateString(15 * 60 * 1000), // 15 min ago
    reportId: 'PR-9102',
  },
  {
    id: 'notif-3',
    title: 'Officer Assigned',
    message: 'Officer Rajesh Kumar has been assigned to inspect and resolve your report #PR-9034.',
    type: 'assignment',
    read: false,
    createdAt: getPastDateString(2 * 60 * 60 * 1000), // 2 hours ago
    reportId: 'PR-9034',
  },
  {
    id: 'notif-4',
    title: 'Road Fixed',
    message: 'The reported issue at Sector 62 Main Road has been successfully repaired and verified.',
    type: 'success',
    read: true,
    createdAt: getPastDateString(24 * 60 * 60 * 1000), // Yesterday
    reportId: 'PR-8991',
  },
  {
    id: 'notif-5',
    title: 'Admin Announcement',
    message: 'System maintenance is scheduled on Sunday, July 26th, from 2:00 AM to 4:00 AM. Expect brief downtime.',
    type: 'admin',
    read: true,
    createdAt: getPastDateString(2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 'notif-6',
    title: 'Report Rejected',
    message: 'Your report #PR-9105 was rejected because it was identified as a duplicate submission.',
    type: 'warning',
    read: true,
    createdAt: getPastDateString(5 * 24 * 60 * 60 * 1000), // 5 days ago
    reportId: 'PR-9105',
  },
];

export const getNotifications = (): Notification[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_NOTIFICATIONS));
    return INITIAL_MOCK_NOTIFICATIONS;
  }
  try {
    return JSON.parse(stored) as Notification[];
  } catch (e) {
    console.error('Failed to parse notifications, resetting storage', e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_NOTIFICATIONS));
    return INITIAL_MOCK_NOTIFICATIONS;
  }
};

export const saveNotifications = (notifications: Notification[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

export const markAsRead = (id: string): Notification[] => {
  const notifications = getNotifications();
  const updated = notifications.map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  saveNotifications(updated);
  return updated;
};

export const markAllAsRead = (): Notification[] => {
  const notifications = getNotifications();
  const updated = notifications.map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
  return updated;
};

export const deleteNotification = (id: string): Notification[] => {
  const notifications = getNotifications();
  const updated = notifications.filter((n) => n.id !== id);
  saveNotifications(updated);
  return updated;
};

export const createNotification = (
  notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
): Notification[] => {
  const notifications = getNotifications();
  const newNotif: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [newNotif, ...notifications];
  saveNotifications(updated);
  return updated;
};
