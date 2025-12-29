// components/Calendar.js
"use client"

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths } from 'date-fns';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function Calendar({ onDateChange }) {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onDateClick = (day) => {
    setSelectedDate(day);
    onDateChange(day); // Pass selected day back to parent component
  };
  
  const monthIndex = currentMonth.getMonth(); // Get the month index (0-11)
  const year = format(currentMonth, "yyyy");
  
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t('date.tab1')}</h2>
        <div className="flex items-center gap-x-3">
          <button onClick={prevMonth}>
            <Image src="/assets/images/icons/left-arrow.png" height={40} width={40} alt="" />
          </button>
          <h2 className="text-sm font-semibold">
            {t(`date.tab${monthIndex + 2}`)} {year}
          </h2>
          <button onClick={nextMonth}>
            <Image src="/assets/images/icons/right-arrow.png" height={40} width={40} alt="" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [
      t('date.tab14'),
      t('date.tab15'),
      t('date.tab16'),
      t('date.tab17'),
      t('date.tab18'),
      t('date.tab19'),
      t('date.tab20')
    ];

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div key={index} className="text-xs text-center text-[#a797cc] p-1 rounded-lg bg-[#fff6e3]">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;

        days.push(
          <div
            className={`p-2 py-3 text-center cursor-pointer ${!isSameMonth(day, monthStart)
              ? 'text-gray-300'
              : isSameDay(day, selectedDate)
                ? 'bg-black text-white rounded-xl'
                : 'text-gray-700'
              }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="text-sm">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <>
      <div className="w-full md:mt-6 lg:mt-16">
        <div>
          {renderHeader()}
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          {renderDays()}
          {renderCells()}
        </div>
      </div>
    </>
  );
}

function isSameMonth(day, monthStart) {
  return format(day, 'M') === format(monthStart, 'M');
}

function isSameDay(day, selectedDate) {
  return format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
}
