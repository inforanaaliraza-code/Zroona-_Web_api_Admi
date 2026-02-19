import React from 'react';

const ToggleSwitch = ({ isOn, handleToggle }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={handleToggle}
      className={`relative inline-flex items-center cursor-pointer rounded-full transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 ${
        isOn ? 'bg-green-500' : 'bg-gray-300'
      } w-11 h-6 p-0.5`}
    >
      <span
        className={`block w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-out ${
          isOn ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;
