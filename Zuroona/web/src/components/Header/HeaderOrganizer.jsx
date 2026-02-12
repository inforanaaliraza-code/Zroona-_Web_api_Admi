"use client"

import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '../Searchbar/Searchbar';
import { useState, useEffect } from 'react';
import LoginModal from '../Modal/LoginModal';
import DropdownOrganizer from './DropdownOrganizer';
import { useDispatch, useSelector } from 'react-redux';
import { getUserNotificationCount } from '@/redux/slices/UserNotificatonCount';
import Cookies from 'universal-cookie';
import { TOKEN_NAME } from '@/until';
import { getProfile } from '@/redux/slices/profileInfo';
import Loader from '../Loader/Loader';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { LanguageApi } from '@/app/api/setting';
import { toast } from 'react-toastify';
import { showGreenTick } from '@/utils/toastHelpers';
import { getCategoryList } from '@/redux/slices/CategoryList';
import { getCategoryEventList } from '@/redux/slices/CategoryEventList';
import { Icon } from "@iconify/react";

const HeaderOrganizer = ({ bgColor, hideLogo = false }) => {
    const dispatch = useDispatch();
    const [token, setToken] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    // OTP handled inside LoginModal
    const [loading, setLoading] = useState(false);
    const openLoginModal = () => setLoginModalOpen(true);
    const closeLoginModal = () => setLoginModalOpen(false);
    const { UserNotificationCount } = useSelector((state) => state.UserNotificatonCountData);

    // No separate OTP modal in header

    const { profile, loadingProfile } = useSelector((state) => state.profileData);
    const profileData = profile?.user?.role == 2 ? profile.user : null;

    // Prevent hydration errors by reading cookies only on client
    useEffect(() => {
        setIsMounted(true);
        const cookie = new Cookies();
        const authToken = cookie.get(TOKEN_NAME);
        setToken(authToken);
    }, []);

    useEffect(() => {
        if (isMounted && token) {
            dispatch(getProfile());
        }
    }, [token, dispatch, isMounted]);

    useEffect(() => {
        if (isMounted) {
            dispatch(getUserNotificationCount());
        }
    }, [dispatch, isMounted]);

    const { t, i18n } = useTranslation();

    const ChangeLanguage = (language) => {
        setLoading(true);
        const payload = { language: language };

        LanguageApi(payload)
            .then((res) => {
                setLoading(false);
                if (res?.status === 1) {
                    showGreenTick();
                    i18n.changeLanguage(language);

                    console.log("Dispatching getCategoryList");
                dispatch(getCategoryList({ page: page }));

                console.log("Dispatching getCategoryEventList");
                dispatch(getCategoryEventList({ page: page, limit: 6 }));
                } else {
                    toast.error(res?.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                toast.error(t("auth.failedToChangeLanguage") || "Failed to change language");
            });
    };

    return (
        <>
            {/* Logo and Navigation */}
            <div className="relative z-50 pb-24 sm:pb-20 md:pb-20 lg:pb-20" style={{ backgroundColor: bgColor || '#fff' }}>
                <div className="absolute top-0 left-0 right-0 z-10 w-full border-b border-[#b0a0df]/30 bg-[#b0a0df] shadow-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="p-4 md:p-0 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 lg:space-x-4 min-h-[72px]">

                    {/* Logo and Search Bar */}
                    <div className=' w-full lg:w-auto flex flex-row justify-between items-center gap-y-4 gap-x-2 sm:gap-x-5'>
                        {/* Logo - Centered Vertically, Bigger, Responsive */}
                        {!hideLogo && (
                            <>
                                {/* Desktop Logo - Bigger sizes */}
                                <div className="hidden sm:block flex items-center h-full pt-1">
                                    <Link href="/joinUsEvent" className="flex items-center justify-center h-full transition-transform duration-300 hover:scale-105">
                                        <Image
                                            src="/assets/images/x_F_logo.png"
                                            width={300}
                                            height={90}
                                            alt="Logo"
                                            className='object-contain w-auto h-auto
                                              max-h-[60px] sm:max-h-[65px] md:max-h-[75px] lg:max-h-[85px] xl:max-h-[90px]
                                              max-w-[220px] sm:max-w-[250px] md:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px]
                                              brightness-0 invert'
                                        />
                                    </Link>
                                </div>

                                {/* Mobile Logo - Bigger sizes */}
                                <div className="block sm:hidden flex items-center h-full pt-1">
                                    <Link href="/joinUsEvent" className="flex items-center justify-center h-full transition-transform duration-300 hover:scale-105">
                                        <Image
                                            src="/assets/images/x_F_logo.png"
                                            width={200}
                                            height={60}
                                            alt="Logo"
                                            className='object-contain w-auto h-auto
                                              max-h-[50px] max-w-[50px]
                                              brightness-0 invert'
                                        />
                                    </Link>
                                </div>
                            </>
                        )}
                        {/* {token && (
                            <div className='lg:block hidden'>
                                <SearchBar />
                            </div>
                        )} */}

                        <div className='lg:hidden block'>
                            <div className='flex flex-col sm:flex-row justify-end items-center gap-y-4 sm:gap-y-0 gap-x-5'>
                                <div className='flex justify-end items-center gap-x-3 sm:gap-x-5'>
                                    <LanguageSwitcher ChangeLanguage={ChangeLanguage} />
                                    {isMounted && token && (
                                        <div className="flex items-center mr-2 relative z-10" onClick={(e) => e.stopPropagation()}>
                                            <Link 
                                                href="/notification" 
                                                className="relative"
                                                onClick={(e) => {
                                                    // Stop event propagation to prevent dropdown from opening
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <Icon icon="lucide:bell" className="w-[12px] h-[15px] text-brand-gray-purple-2" />
                                                {/* Notification Badge */}
                                                <span className="absolute -top-1 -right-1 sm:-top-1 sm:-right-1 bg-gray-950 text-white text-[0.45rem] sm:text-[0.5rem] font-semibold w-3 h-3 sm:w-3 sm:h-3 rounded-full flex items-center justify-center">
                                                    {UserNotificationCount?.unreadCount > 0 ? UserNotificationCount.unreadCount : 3}
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                    {isMounted && token && (
                                        loadingProfile ? (
                                            <div className="flex items-center justify-center">
                                                <Loader height="23" />
                                            </div>
                                        ) : (
                                            <DropdownOrganizer profile={profileData} />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Language and Auth Links for larger screens */}
                    <div className='lg:block hidden'>
                        <div className='flex flex-col sm:flex-row justify-end items-center gap-y-4 sm:gap-y-0 gap-x-5'>
                            <div className='flex items-center gap-x-4'>
                                <LanguageSwitcher ChangeLanguage={ChangeLanguage} />
                            </div>
                            {isMounted && token && (
                                <div className="flex items-center mr-3 relative z-10" onClick={(e) => e.stopPropagation()}>
                                    <Link 
                                        href="/notification" 
                                        className="relative"
                                        onClick={(e) => {
                                            // Stop event propagation to prevent dropdown from opening
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Icon icon="lucide:bell" className="w-[12px] h-[15px] text-brand-gray-purple-2" />
                                        {/* Notification Badge */}
                                        {UserNotificationCount?.unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 sm:-top-1 sm:-right-1 bg-gray-950 text-white text-[0.45rem] sm:text-[0.5rem] font-semibold w-3 h-3 sm:w-3 sm:h-3 rounded-full flex items-center justify-center">
                                                {UserNotificationCount?.unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            )}
                            {/* Show DropdownUser if user is logged in */}
                            {isMounted && token && (
                                <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
                                    {loadingProfile ? (
                                        <div className="flex items-center justify-center">
                                            <Loader height="23" />
                                        </div>
                                    ) : (
                                        <DropdownOrganizer profile={profileData} />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>


                    {/* <div className='lg:hidden block w-full'>
                        <SearchBar />
                    </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </>
    );
};

export default HeaderOrganizer;
