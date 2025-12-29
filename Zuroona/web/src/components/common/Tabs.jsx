import React from 'react';

const Tabs = ({ tabs, selectedTab, setSelectedTab }) => {
  return (
    <div className="flex flex-wrap space-x-2 sm:space-x-4 mb-6 justify-center md:justify-start">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setSelectedTab(index)}
          className={`py-2 sm:py-2 px-6 sm:px-7 rounded-lg text-xs sm:text-sm ${index === selectedTab ? 'bg-[#a797cc] text-white border-2 border-transparent' : 'text-gray-800 border-2 bg-white border-[#a797cc]'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
