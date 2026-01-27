"use client";

import { MoveRightIcon } from "lucide-react";
import DropdownUser from "./DropdownUser";
import PageTitle from "../ui/PageTitle"; // Adjust the path according to your file structure
import SearchBar from "../ui/Searchbar";
import { TOKEN_NAME } from "@/until";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";
import NotificationBell from "./NotificationBell";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Header = ({ sidebarOpen, setSidebarOpen, search, setSearch, setPage, searchPlaceholder }) => {
  const { t } = useTranslation();
  const { push } = useRouter();

  async function logout(e) {
    Cookies.remove(TOKEN_NAME);
    push("/");
  }

  return (
    <>
      <header className="sticky top-0 z-[999] flex w-full mt-4 animate-fade-in">
        <div className="flex flex-grow items-center justify-between px-4 py-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg shadow-brand-pastel-gray-purple-1/20 border border-white/50 hover:shadow-xl hover:shadow-brand-pastel-gray-purple-1/30 transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            {/* <!-- Hamburger Toggle BTN --> */}
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
              className="z-[99999] block rounded-xl border-2 border-brand-pastel-gray-purple-1 bg-white p-2 shadow-md hover:shadow-lg hover:bg-brand-pastel-gray-purple-1/10 transition-all duration-300 lg:hidden group"
            >
              <span className="relative block h-5 w-6 cursor-pointer">
                <span className="du-block absolute right-0 h-full w-full">
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-brand-pastel-gray-purple-1 delay-[0] duration-200 ease-in-out transition-all ${!sidebarOpen && "!w-full delay-300"}`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-brand-pastel-gray-purple-1 delay-150 duration-200 ease-in-out transition-all ${!sidebarOpen && "delay-400 !w-full"}`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-brand-pastel-gray-purple-1 delay-200 duration-200 ease-in-out transition-all ${!sidebarOpen && "!w-full delay-500"}`}
                  ></span>
                </span>
                <span className="absolute right-0 h-full w-full rotate-45">
                  <span
                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-brand-pastel-gray-purple-1 delay-300 duration-200 ease-in-out transition-all ${!sidebarOpen && "!h-0 !delay-[0]"}`}
                  ></span>
                  <span
                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-brand-pastel-gray-purple-1 duration-200 ease-in-out transition-all ${!sidebarOpen && "!h-0 !delay-200"}`}
                  ></span>
                </span>
              </span>
            </button>
          </div>

          {/* Seach bar */}
          <div className="hidden lg:block animate-fade-in">
            <SearchBar search={search} setSearch={setSearch} setPage={setPage} placeholder={searchPlaceholder} />
          </div>

          <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-3 xl:gap-x-6">

            {/* Language Switcher */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <LanguageSwitcher />
            </div>

            {/* Notification icon */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <NotificationBell />
            </div>

            {/* <!-- User Area --> */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <DropdownUser />
            </div>

            {/* <!-- Logout --> */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={(e) => {
                  logout(e);
                }}
                className="w-full flex items-center justify-center gap-2 p-2 sm:p-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-brand-pastel-gray-purple-1 to-brand-gray-purple-2 hover:from-brand-gray-purple-2 hover:to-brand-pastel-gray-purple-1 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Image src="/assets/images/home/logout.png" alt="Logout" height={20} width={20} className="w-[16px] sm:w-[20px] transition-transform duration-300 group-hover:rotate-12" />
                <span className="hidden sm:inline">{t("common.logout")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-5 block lg:hidden animate-fade-in">
        <SearchBar search={search} setSearch={setSearch} setPage={setPage} placeholder={searchPlaceholder} />
      </div>
    </>
  );
};

export default Header;
