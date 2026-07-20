import React from 'react';
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiUser,
  FiInfo,
  FiTrash2,
  FiEye,
} from 'react-icons/fi';
import type { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClickReport?: (reportId: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClickReport,
}) => {
  const { id, title, message, type, read, createdAt, reportId } = notification;

  const getIcon = () => {
    switch (type) {
      case 'report':
        return <FiInfo className="notif-icon notif-icon--report" />;
      case 'warning':
        return <FiAlertTriangle className="notif-icon notif-icon--warning" />;
      case 'success':
        return <FiCheckCircle className="notif-icon notif-icon--success" />;
      case 'admin':
        return <FiInfo className="notif-icon notif-icon--admin" />;
      case 'assignment':
        return <FiUser className="notif-icon notif-icon--assignment" />;
      default:
        return <FiInfo className="notif-icon" />;
    }
  };

  const formatRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return 'Just now';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div
      className={`notification-item ${read ? 'notification-item--read' : 'notification-item--unread'}`}
      role="listitem"
      tabIndex={0}
      aria-label={`${read ? 'Read' : 'Unread'} notification: ${title}. ${message}`}
    >
      <div className="notification-item__icon-wrapper">{getIcon()}</div>

      <div className="notification-item__content">
        <div className="notification-item__header">
          <h4 className="notification-item__title">{title}</h4>
          <span className="notification-item__time">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        <p className="notification-item__message">{message}</p>

        {reportId && onClickReport && (
          <button
            type="button"
            className="notification-item__report-btn"
            onClick={() => onClickReport(reportId)}
            aria-label={`View report ${reportId}`}
          >
            <FiEye /> View Report Details
          </button>
        )}
      </div>

      <div className="notification-item__actions">
        {!read && (
          <button
            type="button"
            className="notification-item__action-btn notification-item__action-btn--read"
            onClick={() => onMarkAsRead(id)}
            title="Mark as read"
            aria-label="Mark notification as read"
          >
            <FiCheckCircle />
          </button>
        )}
        <button
          type="button"
          className="notification-item__action-btn notification-item__action-btn--delete"
          onClick={() => onDelete(id)}
          title="Delete notification"
          aria-label="Delete notification"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};
