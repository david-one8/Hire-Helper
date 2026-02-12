import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Trash2, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { EmptyNotificationsState } from './EmptyStates';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'request',
      title: 'New Help Request',
      message: 'Sarah Johnson requested help for "Computer Setup Help"',
      time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      id: 2,
      type: 'accepted',
      title: 'Request Accepted',
      message: 'Robert Wilson accepted your request for "Garden Cleanup"',
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    },
    {
      id: 3,
      type: 'completed',
      title: 'Task Completed',
      message: 'Your task "Help Moving Furniture" has been marked as completed',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      avatar: null,
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      message: 'Emily Chen sent you a message about "Room Painting Project"',
      time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
  ]);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      request: '🤝',
      accepted: '✅',
      completed: '🎉',
      message: '💬',
      default: '🔔',
    };
    return icons[type] || icons.default;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <EmptyNotificationsState />
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      p-4 border-b border-gray-200 dark:border-dark-700 last:border-b-0
                      hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors
                      ${!notification.read ? 'bg-primary-50/30 dark:bg-primary-950/20' : ''}
                    `}
                  >
                    <div className="flex gap-3">
                      {/* Avatar/Icon */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-xl">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDistanceToNow(notification.time, { addSuffix: true })}
                          </span>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-950 rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
                              title="Delete"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-dark-700 text-center">
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
