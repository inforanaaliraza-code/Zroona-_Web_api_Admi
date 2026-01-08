import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

const EditProfileSidebar = ({ onItemClick, activeSection }) => {
    const { t, i18n } = useTranslation();
    const [activeItem, setActiveItem] = useState(0);
    const [hoveredItem, setHoveredItem] = useState(null);

    const sidebarItems = [
        { key: "personal", title: t('steper.tab1'), icon: "mdi:account-outline", fillIcon: "mdi:account" },
        { key: "bank", title: t('steper.tab3'), icon: "mdi:bank-outline", fillIcon: "mdi:bank" },
        { key: "settings", title: t('Settings') || 'Settings', icon: "mdi:cog-outline", fillIcon: "mdi:cog" },
    ];

    useEffect(() => {
        onItemClick(sidebarItems[0].key);
    }, []);

    const handleItemClick = (index, sectionKey) => {
        setActiveItem(index);
        onItemClick(sectionKey);
    };

    return (
        <div className={`bg-white rounded-lg h-max ${i18n.language === "ar" ? "p-6 pl-0" : "p-6 pr-0"
            }`}>
            <h2 className="text-xl font-bold mb-4">{t('breadcrumb.tab3')}</h2>
            <ul className="flex flex-col gap-y-2 mb-6">
                {sidebarItems.map((item, index) => (
                    <li
                        key={item.key}
                        className={`flex items-center gap-x-2 py-1 cursor-pointer text-sm font-semibold hover:text-[#a797cc] ${i18n.language === "ar" ? "border-l-4" : "border-r-4" } hover:border-[#a797cc] ${(activeSection === item.key || activeItem === index)
                            ? 'text-[#a797cc] border-[#a797cc]'
                            : 'text-black border-transparent'
                            }`}
                        onClick={() => handleItemClick(index, item.key)}
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <Icon
                            icon={activeItem === index || hoveredItem === index
                                ? item.fillIcon
                                : item.icon
                            }
                            className={`w-5 h-5 ${activeItem === index || hoveredItem === index 
                                ? 'text-[#a797cc]' 
                                : 'text-gray-500'}`}
                        />
                        {item.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EditProfileSidebar;
