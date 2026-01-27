import Image from 'next/image';
import { useState } from 'react';

const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Any Distance');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block w-fit">
            {/* Dropdown Trigger */}
            <button
                className="py-4 pl-4 pr-10 text-left bg-gray-100 border-gray-400 rounded-lg text-sm text-gray-800 focus:outline-none w-[140px]"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption}
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Image src="/assets/images/icons/arrow-down.png" height={12} width={12} alt="" />
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute mt-1 w-[140px] bg-white border-gray-300 rounded-lg shadow-lg z-10 overflow-hidden">
                    <ul className="">
                        {['Any Distance', '5 Miles', '10 Miles', '20 Miles'].map((option) => (
                            <li
                                key={option}
                                className={` px-4 py-2 cursor-pointer text-gray-900 text-sm hover:bg-[#a797cc] hover:text-white ${selectedOption === option ? 'bg-[#a797cc] text-white' : ''}`}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
