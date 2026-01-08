// Searchbar.js

import Image from "next/image";
import React from "react";

const SearchBar = ({ search, setSearch, setPage, placeholder }) => {
  return (
    <div className="flex gap-x-3">
      <div className="flex items-center border-2 border-brand-pastel-gray-purple-1/30 bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden w-[250px] sm:w-[300px] shadow-md hover:shadow-lg hover:border-brand-pastel-gray-purple-1/50 transition-all duration-300 focus-within:border-brand-pastel-gray-purple-1 focus-within:shadow-lg">
        <Image src="/assets/images/home/search.png" height={20} width={20} alt="Search" className="ml-3 opacity-60" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
          placeholder={placeholder || "Search by Guest Name / Email ID"}
          className="w-full p-2.5 outline-none text-sm text-gray-800 placeholder:text-gray-400 placeholder:text-xs bg-transparent"
        />
      </div>
      <button className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-brand-pastel-gray-purple-1 to-brand-gray-purple-2 hover:from-brand-gray-purple-2 hover:to-brand-pastel-gray-purple-1 text-white text-sm font-semibold capitalize shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
        search
      </button>
    </div>
  );
};

export default SearchBar;
