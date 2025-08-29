import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Simple Date Picker
export function UIDatePicker({
  selected,
  onChange,
  minDate,
  maxDate,
  placeholder,
  ...props
}: {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  [key: string]: any;
}) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      placeholderText={placeholder}
      dateFormat="yyyy-MM-dd"
      className="h-10 px-3 py-2 border rounded-md w-full md:text-sm text-base"
      {...props}
    />
  );
}

// Time Picker (only time selection)
export function UITimePicker({
  selected,
  onChange,
  placeholder,
  ...props
}: {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  [key: string]: any;
}) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      showTimeSelect
      showTimeSelectOnly
      dateFormat="HH:mm"
      placeholderText={placeholder}
      className="h-10 px-3 py-2 border rounded-md w-full md:text-sm text-base"
      {...props}
    />
  );
}

// Date Range Picker
export function UIDateRangePicker({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  placeholder,
  ...props
}: {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  [key: string]: any;
}) {
  return (
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      placeholderText={placeholder || "Select date range"}
      dateFormat="yyyy-MM-dd"
      className="h-10 px-3 py-2 border rounded-md w-full md:text-sm text-base"
      {...props}
    />
  );
}
