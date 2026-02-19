// Searchbar.js

import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const SearchBar = ({ search, setSearch, setPage, placeholder }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-3 w-full min-w-0">
      <div className="flex flex-1 min-w-0 items-center border-2 border-brand-pastel-gray-purple-1/30 bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden w-full sm:max-w-[300px] shadow-md hover:shadow-lg hover:border-brand-pastel-gray-purple-1/50 transition-all duration-300 focus-within:border-brand-pastel-gray-purple-1 focus-within:shadow-lg">
        <Image src="/assets/images/home/search.png" height={20} width={20} alt={t("common.search")} className="ml-3 mr-3 opacity-60 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
          placeholder={placeholder || t("common.searchByGuestNameEmail")}
          className="w-full p-2.5 outline-none text-sm text-gray-800 placeholder:text-gray-400 placeholder:text-xs bg-transparent"
        />
      </div>
      <button type="button" className="py-2.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-brand-pastel-gray-purple-1 to-brand-gray-purple-2 hover:from-brand-gray-purple-2 hover:to-brand-pastel-gray-purple-1 text-white text-sm font-semibold capitalize shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 w-full sm:w-auto">
        {t("common.search")}
      </button>
    </div>
  );
};

export default SearchBar;
