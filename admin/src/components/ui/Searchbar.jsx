// Searchbar.js

import Image from "next/image";
import React from "react";

const SearchBar = ({ search, setSearch, setPage }) => {
  return (
    <div className="flex gap-x-2">
      <div className="flex items-center border-gray-300 bg-white border rounded-md overflow-hidden w-[250px] sm:w-[300px]">
        <Image src="/assets/images/home/search.png" height={20} width={20} alt="Search" className="ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
          placeholder="Search by Organizer name/ID.."
          className="w-full p-2 outline-none text-sm text-gray-800 placeholder:text-gray-400 placeholder:text-xs"
        />
      </div>
      <button className="py-2 px-6 rounded-lg bg-[#F47C0C] text-white text-sm capitalize">
        search
      </button>
    </div>
  );
};

export default SearchBar;
