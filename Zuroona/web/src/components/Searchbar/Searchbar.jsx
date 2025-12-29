// import { Search } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";

const SearchBar = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex gap-x-2">
        <div className="flex items-center border-gray-300 bg-white border rounded-md overflow-hidden w-full md:w-[370px]">
          <Icon icon="lucide:search" className="w-5 h-5 text-brand-gray-purple-2 ml-2" />
          <input
            type="text"
            value={props.search}
            onChange={(e) => {
              props.setSearch(e.target.value);
              props.setPage(1);
            }}
            placeholder={t('header.tab1')}
            className="w-full p-2 outline-none text-sm text-gray-800 placeholder:text-gray-400 placeholder:text-xs"
          />
          <div className="w-full border-l border-gray-400 pl-3">
            <p className="w-full text-xs text-gray-400 text-center sm:text-left">{t('header.tab2')}</p>
          </div>
        </div>
        <button className="py-2 px-3 rounded-lg bg-[#a797cc] text-white text-sm capitalize">
          {t('header.tab3')}
        </button>
      </div>
    </>
  );
};

export default SearchBar;
