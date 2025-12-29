// components/Calendar.js
"use client"

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths } from 'date-fns';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { startOfDay } from 'date-fns';

export default function SelectDate({ selectedDate: propSelectedDate, onDateChange }) {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Convert propSelectedDate to Date object if it's a string
  const getDateFromProp = (dateValue) => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  };
  
  const [selectedDate, setSelectedDate] = useState(() => getDateFromProp(propSelectedDate) || new Date());
  
  // Update selectedDate when prop changes
  useEffect(() => {
    const newDate = getDateFromProp(propSelectedDate);
    if (newDate) {
      setSelectedDate(newDate);
      // Also update currentMonth to show the selected date's month
      setCurrentMonth(newDate);
    }
  }, [propSelectedDate]);

  const onDateClick = (day) => {
    setSelectedDate(day);
    // Format date as YYYY-MM-DD string for form input
    const formattedDate = format(day, 'yyyy-MM-dd');
    onDateChange(formattedDate); // Pass formatted date string back to parent component
  };

  const monthIndex = currentMonth.getMonth(); // Get the month index (0-11)
  const year = format(currentMonth, "yyyy");

  const renderHeader = () => {
    const monthNames = [
      t('date.tab2'), // January
      t('date.tab3'), // February
      t('date.tab4'), // March
      t('date.tab5'), // April
      t('date.tab6'), // May
      t('date.tab7'), // June
      t('date.tab8'), // July
      t('date.tab9'), // August
      t('date.tab10'), // September
      t('date.tab11'), // October
      t('date.tab12'), // November
      t('date.tab13'), // December
    ];
    
    return (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{t('date.tab1') || 'Select Date'}</h2>
        <div className="flex items-center gap-x-3">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <Image src="/assets/images/icons/left-arrow.png" height={24} width={24} alt="Previous month" />
          </button>
          <h2 className="text-sm font-semibold text-gray-800 min-w-[120px] text-center">
            {monthNames[monthIndex] || format(currentMonth, 'MMMM')} {year}
          </h2>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <Image src="/assets/images/icons/right-arrow.png" height={24} width={24} alt="Next month" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [
      t('date.tab14') || 'Sun',
      t('date.tab15') || 'Mon',
      t('date.tab16') || 'Tue',
      t('date.tab17') || 'Wed',
      t('date.tab18') || 'Thu',
      t('date.tab19') || 'Fri',
      t('date.tab20') || 'Sat'
    ];

    return (
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day, index) => (
          <div key={index} className="text-xs font-semibold text-center text-[#a797cc] p-2 rounded-lg bg-[#fff6e3]">
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
    const today = startOfDay(new Date());  // Get today's date without time
  
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
  
        // Check if the date is before today
        const isBeforeToday = cloneDay < today;
  
        const isClickable = !isBeforeToday && isSameMonth(day, monthStart);
        const isSelected = isSameDay(day, selectedDate);
        
        days.push(
          <div
            className={`p-2 py-3 text-center transition-all duration-200 select-none
              ${!isSameMonth(day, monthStart) 
                ? 'text-gray-300 cursor-default'  // Disable days outside current month
                : isBeforeToday 
                  ? 'text-gray-300 cursor-not-allowed opacity-50'  // Disable past dates
                  : isSelected
                    ? 'bg-[#a797cc] text-white rounded-xl font-semibold shadow-md'  // Highlight selected date
                    : 'text-gray-700 hover:bg-[#a797cc] hover:text-white hover:rounded-lg cursor-pointer active:scale-95'  // Default style with hover
              }`}
            key={day.toISOString()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isClickable) {
                onDateClick(cloneDay);  // Only allow clicking on valid dates
              }
            }}
            onMouseDown={(e) => {
              if (isClickable) {
                e.preventDefault();
              }
            }}
            role="button"
            tabIndex={isClickable ? 0 : -1}
            aria-label={`Select date ${formattedDate}`}
            aria-disabled={!isClickable}
          >
            <span className="text-sm font-medium pointer-events-none">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2" key={day.toISOString()}>
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
    <div className="w-full">
      <div className="mb-4">
        {renderHeader()}
      </div>
      <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100">
        {renderDays()}
        <div className="mt-2">
          {renderCells()}
        </div>
        {selectedDate && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-semibold text-[#a797cc]">
                {(() => {
                  // Try to get translation, with fallback if key is returned as-is
                  let translated = t('events.selectedDate');
                  // If translation returns the key itself, it means translation wasn't found
                  if (translated === 'events.selectedDate') {
                    translated = t('add.selectedDate');
                    if (translated === 'add.selectedDate') {
                      translated = 'Selected date';
                    }
                  }
                  return `${translated}: ${format(selectedDate, 'yyyy-MM-dd')}`;
                })()}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function isSameMonth(day, monthStart) {
  return format(day, 'M') === format(monthStart, 'M');
}

function isSameDay(day, selectedDate) {
  if (!selectedDate) return false;
  // Handle both Date objects and string dates
  const dayStr = format(day, 'yyyy-MM-dd');
  const selectedStr = selectedDate instanceof Date 
    ? format(selectedDate, 'yyyy-MM-dd')
    : selectedDate;
  return dayStr === selectedStr;
}
