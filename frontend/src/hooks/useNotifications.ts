import { useState, useEffect, useCallback } from 'react';
import type { Notification } from '../types/notification';
import * as service from '../services/notificationService';

let listeners: Array<(notifications: Notification[]) => void> = [];

const notifyListeners = (newNotifications: Notification[]) => {
  listeners.forEach((listener) => listener(newNotifications));
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    service.getNotifications()
  );

  useEffect(() => {
    const handleUpdate = (updatedList: Notification[]) => {
      setNotifications(updatedList);
    };

    listeners.push(handleUpdate);

    return () => {
      listeners = listeners.filter((l) => l !== handleUpdate);
    };
  }, []);

  const markAsRead = useCallback((id: string) => {
    const updated = service.markAsRead(id);
    notifyListeners(updated);
  }, []);

  const markAllAsRead = useCallback(() => {
    const updated = service.markAllAsRead();
    notifyListeners(updated);
  }, []);

  const deleteNotification = useCallback((id: string) => {
    const updated = service.deleteNotification(id);
    notifyListeners(updated);
  }, []);

  const createNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
      const updated = service.createNotification(notification);
      notifyListeners(updated);
    },
    []
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
  };
};
