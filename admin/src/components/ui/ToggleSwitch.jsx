import React, { useState } from 'react';

const ToggleSwitch = ({ isOn, handleToggle }) => {
  return (
    <div className="flex items-center">
      <div
        onClick={handleToggle}
        className={`relative inline-flex items-center cursor-pointer ${
          isOn ? 'bg-green-500' : 'bg-gray-300'
        } p-1 rounded-full transition-colors duration-300 ease-in-out w-6 h-3`}
      >
        <div
          className={`w-2 h-2 bg-white rounded-full shadow-md transform ${
            isOn ? 'translate-x-[10px]' : 'translate-x-[-1px]'
          } transition-transform duration-300 ease-in-out`}
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;
