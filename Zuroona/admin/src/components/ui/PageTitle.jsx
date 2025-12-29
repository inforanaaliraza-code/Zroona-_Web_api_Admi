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
            <ol className="inline-flex items-center gap-2">
                {breadcrumbs.map((item, index) => (
                    <li key={index} className="inline-flex items-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        {index > 0 && (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-brand-pastel-gray-purple-1 mx-2 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
                            </svg>
                        )}
                        {item.isCurrent ? (
                            <span className="text-xs lg:text-sm text-gray-800 font-semibold bg-gradient-to-r from-brand-pastel-gray-purple-1 to-brand-gray-purple-2 bg-clip-text text-transparent">
                                {item.label}
                            </span>
                        ) : (
                            <Link 
                                href={item.href} 
                                className="text-brand-pastel-gray-purple-1 hover:text-brand-gray-purple-2 font-semibold inline-flex items-center text-xs lg:text-sm transition-colors duration-300 hover:underline"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
