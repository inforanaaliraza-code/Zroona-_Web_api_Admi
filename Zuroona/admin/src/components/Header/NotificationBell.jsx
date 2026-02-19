"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ClickOutside from "./ClickOutside";
import { GetAdminNotificationsApi } from "@/api/admin/apis";
import { useTranslation } from "react-i18next";

const NotificationBell = () => {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const isArabic = i18n.language === "ar";

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
        const rawList = res?.data || [];
        setNotifications(rawList.map((n) => {
          let typeStr = "other";
          if (n.notification_type === 1) typeStr = "organizer";
          else if (n.notification_type === 2) typeStr = "event";
          else if (n.notification_type === 4) typeStr = "withdrawal";
          return {
            _id: n._id,
            description: n.description,
            description_ar: n.description_ar,
            text: n.text,
            title: n.title,
            title_ar: n.title_ar,
            type: typeStr,
            is_read: n.isRead || n.is_read || false,
            created_at: n.createdAt || n.created_at || new Date(),
          };
        }));
        setUnreadCount(rawList.filter((n) => !(n.isRead || n.is_read)).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Resolve message by current UI language (updates when language changes)
  const getMessage = (n) => {
    if (isArabic && n.description_ar) return n.description_ar;
    return n.description || n.text || n.title || t("notifications.title");
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
          className="relative p-2 rounded-xl hover:bg-brand-pastel-gray-purple-1/10 transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <Image
            src="/assets/images/home/notification.png"
            alt={t("notifications.title")}
            height={23}
            width={23}
            className="w-[18px] sm:w-[23px] transition-transform duration-300 group-hover:brightness-110"
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[0.55rem] sm:text-[0.65rem] font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow border-2 border-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-14 w-80 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl z-[10000] max-h-96 overflow-hidden border border-brand-pastel-gray-purple-1/20 animate-scale-in">
            <div className="p-4 border-b border-brand-pastel-gray-purple-1/20 flex justify-between items-center bg-gradient-to-r from-brand-pastel-gray-purple-1/5 to-transparent">
              <h3 className="font-semibold text-gray-900 text-lg">{t("notifications.title")}</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-brand-pastel-gray-purple-1 hover:text-brand-gray-purple-2 font-medium hover:underline transition-colors duration-300"
                >
                  {t("notifications.markAllAsRead")}
                </button>
              )}
            </div>
            <div className="divide-y divide-brand-pastel-gray-purple-1/10 max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <a
                    key={notification._id}
                    href={getNotificationLink(notification.type)}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification._id);
                      }
                      setShowDropdown(false);
                    }}
                    className={`block p-4 hover:bg-gradient-to-r hover:from-brand-pastel-gray-purple-1/10 hover:to-transparent transition-all duration-300 ${
                      !notification.is_read ? "bg-gradient-to-r from-brand-pastel-gray-purple-1/5 to-transparent border-l-4 border-brand-pastel-gray-purple-1" : ""
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-brand-pastel-gray-purple-1/10">
                        <Image
                          src={getNotificationIcon(notification.type)}
                          alt={notification.type}
                          width={20}
                          height={20}
                          className="mt-0"
                        />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.is_read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                          {getMessage(notification)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1.5">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-brand-pastel-gray-purple-1 to-brand-gray-purple-2 rounded-full mt-2 animate-pulse-slow"></div>
                      )}
                    </div>
                  </a>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  <div className="text-4xl mb-2">🔔</div>
                  <p>{t("notifications.noNotifications")}</p>
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

