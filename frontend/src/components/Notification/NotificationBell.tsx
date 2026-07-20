import React, { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';
import './Notification.css';

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="notification-bell-container">
      <button
        type="button"
        className={`icon-button notification-button ${
          isOpen ? 'notification-button--active' : ''
        } ${unreadCount > 0 ? 'notification-button--unread' : ''}`}
        onClick={handleToggle}
        aria-label={`Open notifications. ${unreadCount} unread`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FiBell className={unreadCount > 0 ? 'bell-ringing' : ''} />
        {unreadCount > 0 && <b className="notification-badge">{unreadCount}</b>}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClose={handleClose}
        />
      )}
    </div>
  );
};
