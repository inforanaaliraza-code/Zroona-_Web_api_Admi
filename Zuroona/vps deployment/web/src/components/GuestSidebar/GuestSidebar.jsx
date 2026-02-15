"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { useRTL } from "@/utils/rtl";

const GuestSidebar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isRTL, textAlign, flexDirection, marginStart, marginEnd } = useRTL();

  const menuItems = [
    {
      label: t("sidemenu.tab4") || "My Bookings",
      href: "/myEvents",
      icon: "lucide:calendar-check",
    },
    {
      label: t("header.reviews") || t("sidemenu.tab13") || "My Reviews",
      href: "/my-reviews",
      icon: "lucide:star",
    },
    {
      label: t("refunds.title") || "Refunds",
      href: "/refunds",
      icon: "lucide:receipt-refund",
    },
    {
      label: t("profile.personalInfo") || "Profile",
      href: "/profile",
      icon: "lucide:user",
    },
  ];

  const isActive = (href) => {
    if (href === "/profile") {
      return pathname === "/profile";
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit sticky top-24 ${isRTL ? "text-right" : "text-left"}`}
    >
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    flexDirection
                  } ${
                    active
                      ? "bg-gradient-to-r from-[#a797cc] to-[#8ba179] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#a797cc]"
                  }`}
                >
                  <Icon
                    icon={item.icon}
                    className={`w-5 h-5 flex-shrink-0 ${
                      active ? "text-white" : "text-gray-500"
                    }`}
                  />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default GuestSidebar;
