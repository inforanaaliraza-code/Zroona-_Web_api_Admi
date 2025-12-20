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

const Header = ({ sidebarOpen, setSidebarOpen, search, setSearch, setPage }) => {
  const { push } = useRouter();

  async function logout(e) {
    Cookies.remove(TOKEN_NAME);
    push("/");
  }

  return (
    <>
      <header className="sticky top-0 z-[999] flex w-full mt-4 bg-[#fff] rounded-xl">
        <div className="flex flex-grow items-center justify-between px-4 py-3 shadow-2">
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            {/* <!-- Hamburger Toggle BTN --> */}
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
              className="z-[99999] block rounded-sm border border-stroke border-[#f47c0c] bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
            >
              <span className="relative block h-5 w-6 cursor-pointer">
                <span className="du-block absolute right-0 h-full w-full">
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-[#f47c0c] delay-[0] duration-200 ease-in-out ${!sidebarOpen && "!w-full delay-300"}`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-[#f47c0c] delay-150 duration-200 ease-in-out ${!sidebarOpen && "delay-400 !w-full"}`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-[#f47c0c] delay-200 duration-200 ease-in-out ${!sidebarOpen && "!w-full delay-500"}`}
                  ></span>
                </span>
                <span className="absolute right-0 h-full w-full rotate-45">
                  <span
                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-[#f47c0c] delay-300 duration-200 ease-in-out ${!sidebarOpen && "!h-0 !delay-[0]"}`}
                  ></span>
                  <span
                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-[#f47c0c] duration-200 ease-in-out ${!sidebarOpen && "!h-0 !delay-200"}`}
                  ></span>
                </span>
              </span>
            </button>
          </div>

          {/* Seach bar */}
          <div className="hidden lg:block">
            <SearchBar search={search} setSearch={setSearch} setPage={setPage} />
          </div>

          <div className="flex items-center gap-x-1 sm:gap-x-6 lg:gap-x-2 xl:gap-x-6">

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notification icon */}
            <NotificationBell />

            {/* <!-- User Area --> */}
            <DropdownUser />

            {/* <!-- Logout --> */}
            <div>
              <button
                onClick={(e) => {
                  logout(e);
                }}
                className="w-full flex items-center justify-center gap-2 p-1 sm:p-2 rounded-lg text-black text-sm font-semibold"
              >
                <Image src="/assets/images/home/logout.png" alt="Logout" height={20} width={20} className="w-[16px] sm:w-[20px]" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-5 block lg:hidden ">
        <SearchBar />
      </div>
    </>
  );
};

export default Header;
