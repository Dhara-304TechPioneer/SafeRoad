import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiBellOff } from 'react-icons/fi';
import type { Notification } from '../../types/notification';

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const latestNotifications = notifications.slice(0, 5);
  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const handleViewAll = () => {
    onClose();
    navigate('/notifications');
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) {
      onMarkAsRead(n.id);
    }
    if (n.reportId) {
      onClose();
      navigate(`/report/${n.reportId}`);
    }
  };

  return (
    <div
      className="notification-dropdown"
      ref={dropdownRef}
      role="dialog"
      aria-label="Notifications overview"
    >
      <div className="notification-dropdown__header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <button
            type="button"
            className="notification-dropdown__mark-all"
            onClick={onMarkAllAsRead}
            title="Mark all as read"
          >
            <FiCheck /> Mark all as read
          </button>
        )}
      </div>

      <div className="notification-dropdown__list" role="list">
        {latestNotifications.length === 0 ? (
          <div className="notification-dropdown__empty">
            <FiBellOff size={28} />
            <p>No notifications yet</p>
          </div>
        ) : (
          latestNotifications.map((n) => (
            <div
              key={n.id}
              className={`notification-dropdown__item ${
                n.read
                  ? 'notification-dropdown__item--read'
                  : 'notification-dropdown__item--unread'
              }`}
              onClick={() => handleNotificationClick(n)}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNotificationClick(n);
                }
              }}
            >
              <div
                className={`notification-dropdown__bullet notification-dropdown__bullet--${n.type}`}
              />
              <div className="notification-dropdown__item-content">
                <p className="notification-dropdown__item-title">{n.title}</p>
                <p className="notification-dropdown__item-msg">{n.message}</p>
                <span className="notification-dropdown__item-time">
                  {formatRelativeTime(n.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notification-dropdown__footer">
        <button
          type="button"
          className="notification-dropdown__view-all"
          onClick={handleViewAll}
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
};
