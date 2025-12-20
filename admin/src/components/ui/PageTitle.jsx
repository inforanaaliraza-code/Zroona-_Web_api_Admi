import { useState } from 'react';
import React from 'react';
import Link from "next/link";

export default function PageTitle({ title, breadcrumbs = [], className }) {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    return (
        <nav className={`w-full sm:w-auto flex items-center text-gray-700 rounded-lg px-3 sm:px-5 lg:px-0 ${className}`} aria-label="Breadcrumb">
            <ol className="inline-flex items-center">
                {breadcrumbs.map((item, index) => (
                    <li key={index} className="inline-flex items-center">
                        {index > 0 && (
                            <svg className="w-5 h-5 text-[#bc611e]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
                            </svg>
                        )}
                        {item.isCurrent ? (
                            <span className="text-xs lg:text-sm text-black font-semibold">{item.label}</span>
                        ) : (
                            <Link href={item.href} className="text-[#bc611e] font-semibold inline-flex items-center text-xs lg:text-sm ">
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
