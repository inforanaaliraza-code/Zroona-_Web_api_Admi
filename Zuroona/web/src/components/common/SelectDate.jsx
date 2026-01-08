// components/Calendar.js
"use client"

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { startOfDay } from 'date-fns';

export default function SelectDate({ selectedDate: propSelectedDate, onDateChange }) {
  const { t } = useTranslation();
  // Use null initially to prevent hydration mismatch, set in useEffect
  const [currentMonth, setCurrentMonth] = useState(null);
  
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
  
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Initialize dates on client side only to prevent hydration mismatch
  useEffect(() => {
    if (currentMonth === null || selectedDate === null) {
      const initialDate = getDateFromProp(propSelectedDate) || new Date();
      if (currentMonth === null) {
        setCurrentMonth(initialDate);
      }
      if (selectedDate === null) {
        setSelectedDate(initialDate);
      }
    }
  }, []); // Only run once on mount
  
  // Update selectedDate when prop changes
  useEffect(() => {
    if (currentMonth && selectedDate) {
      const newDate = getDateFromProp(propSelectedDate);
      if (newDate) {
        setSelectedDate(newDate);
        // Also update currentMonth to show the selected date's month
        setCurrentMonth(newDate);
      }
    }
  }, [propSelectedDate]);

  const onDateClick = (day) => {
    setSelectedDate(day);
    // Format date as YYYY-MM-DD string for form input
    const formattedDate = format(day, 'yyyy-MM-dd');
    onDateChange(formattedDate); // Pass formatted date string back to parent component
  };

  const monthIndex = currentMonth ? currentMonth.getMonth() : 0; // Get the month index (0-11)
  const year = currentMonth ? format(currentMonth, "yyyy") : new Date().getFullYear().toString();

  const renderHeader = () => {
    if (!currentMonth) return null;
    
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
      <div className="flex justify-between items-center mb-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            {t('date.tab1') || 'Select Date'} <span className="text-red-500">*</span>
          </label>
        </div>
        <div className="flex items-center gap-x-2">
          <button 
            onClick={prevMonth}
            className="p-1.5 hover:bg-gradient-to-br hover:from-[#a797cc]/10 hover:to-[#a3cc69]/10 rounded-lg transition-all duration-200 border border-gray-200 hover:border-[#a797cc]"
            type="button"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xs font-semibold text-gray-800 min-w-[100px] text-center px-2">
            {monthNames[monthIndex] || format(currentMonth, 'MMMM')} {year}
          </h2>
          <button 
            onClick={nextMonth}
            className="p-1.5 hover:bg-gradient-to-br hover:from-[#a797cc]/10 hover:to-[#a3cc69]/10 rounded-lg transition-all duration-200 border border-gray-200 hover:border-[#a797cc]"
            type="button"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {days.map((day, index) => (
          <div key={index} className="text-[10px] font-semibold text-center text-[#a797cc] py-1.5 px-1 rounded-md bg-gradient-to-br from-[#a797cc]/10 to-[#a3cc69]/10">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    // Guard against null currentMonth during initial render
    if (!currentMonth) return null;
    
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
            className={`py-1.5 px-1 text-center transition-all duration-200 select-none rounded-md
              ${!isSameMonth(day, monthStart) 
                ? 'text-gray-300 cursor-default'  // Disable days outside current month
                : isBeforeToday 
                  ? 'text-gray-300 cursor-not-allowed opacity-40'  // Disable past dates
                  : isSelected
                    ? 'bg-gradient-to-br from-[#a797cc] to-[#a3cc69] text-white rounded-md font-semibold shadow-md scale-105'  // Highlight selected date
                    : 'text-gray-700 hover:bg-gradient-to-br hover:from-[#a797cc]/20 hover:to-[#a3cc69]/20 hover:rounded-md cursor-pointer active:scale-95'  // Default style with hover
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
            <span className="text-xs font-medium pointer-events-none">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };
  

  const nextMonth = () => {
    if (currentMonth) {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const prevMonth = () => {
    if (currentMonth) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  // Show loading state during initial hydration
  if (!currentMonth || !selectedDate) {
    return (
      <div className="w-full">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-center py-6">
            <div className="w-6 h-6 border-3 border-[#a797cc] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-600">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2">
        {renderHeader()}
      </div>
      <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
        {renderDays()}
        <div className="mt-1">
          {renderCells()}
        </div>
        {selectedDate && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
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
