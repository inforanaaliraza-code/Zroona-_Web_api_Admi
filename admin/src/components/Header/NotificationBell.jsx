"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ClickOutside from "./ClickOutside";
import { GetAdminNotificationsApi } from "@/api/admin/apis";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await GetAdminNotificationsApi({ page: 1, limit: 20 });
      if (res?.status === 1 || res?.code === 200) {
        const notifications = res?.data || [];
        setNotifications(notifications.map(n => {
          // Map notification_type to type string
          let typeStr = "other";
          if (n.notification_type === 1) typeStr = "organizer";
          else if (n.notification_type === 2) typeStr = "event";
          else if (n.notification_type === 4) typeStr = "withdrawal";
          
          return {
            _id: n._id,
            message: n.description || n.text || n.title || "Notification",
            type: typeStr,
            is_read: n.isRead || n.is_read || false,
            created_at: n.createdAt || n.created_at || new Date()
          };
        }));
        setUnreadCount(notifications.filter(n => !(n.isRead || n.is_read)).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    // TODO: Replace with actual API call
    // await MarkNotificationReadApi(id);
    setNotifications(notifications.map(n => n._id === id ? { ...n, is_read: true } : n));
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const markAllAsRead = async () => {
    // TODO: Replace with actual API call
    // await MarkAllNotificationsReadApi();
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "organizer":
        return "/assets/images/menu/event-org.png";
      case "event":
        return "/assets/images/menu/event.png";
      case "withdrawal":
        return "/assets/images/menu/wallet.png";
      default:
        return "/assets/images/home/notification.png";
    }
  };

  const getNotificationLink = (type) => {
    switch (type) {
      case "organizer":
        return "/organizer";
      case "event":
        return "/events";
      case "withdrawal":
        return "/withdrawal-requests";
      default:
        return "#";
    }
  };

  return (
    <ClickOutside onClick={() => setShowDropdown(false)} className="relative">
      <div className="flex items-center mr-3">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative"
        >
          <Image
            src="/assets/images/home/notification.png"
            alt="Notification"
            height={23}
            width={23}
            className="w-[18px] sm:w-[23px]"
          />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white text-[0.55rem] sm:text-[0.65rem] font-semibold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl z-[10000] max-h-96 overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#f47c0c] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="divide-y">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <a
                    key={notification._id}
                    href={getNotificationLink(notification.type)}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification._id);
                      }
                      setShowDropdown(false);
                    }}
                    className={`block p-4 hover:bg-gray-50 transition ${
                      !notification.is_read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Image
                        src={getNotificationIcon(notification.type)}
                        alt={notification.type}
                        width={24}
                        height={24}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </a>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No notifications
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ClickOutside>
  );
};

export default NotificationBell;

