"use client";

import { forwardRef, useState } from "react";

import clsx from "clsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateTimePicker.css";

export interface DateTimePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  type?: "date" | "time";
  className?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  id?: string;
}

// Custom input component defined outside to avoid recreation on each render
const CustomInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    type?: "date" | "time";
    disabled?: boolean;
  }
>(
  (
    { value, onClick, placeholder, className, disabled, id, type },
    inputRef
  ) => (
    <div className="position-relative">
      <input
        ref={inputRef}
        type="text"
        className={clsx("form-control border", className)}
        value={value as string}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        id={id}
      />
      <span className="position-absolute top-50 end-0 translate-middle-y me-3 pointer-events-none">
        {type === "time" ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="8" stroke="#999" strokeWidth="1.5" />
            <path d="M10 6V10L13 13" stroke="#999" strokeWidth="1.5" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="4"
              width="14"
              height="13"
              rx="2"
              stroke="#999"
              strokeWidth="1.5"
            />
            <path d="M3 8H17" stroke="#999" strokeWidth="1.5" />
            <path d="M7 2V6" stroke="#999" strokeWidth="1.5" />
            <path d="M13 2V6" stroke="#999" strokeWidth="1.5" />
          </svg>
        )}
      </span>
    </div>
  )
);

CustomInput.displayName = "CustomInput";

/**
 * DateTimePicker component using react-datepicker with Bootstrap styling
 *
 * @example
 * <DateTimePicker
 *   type="date"
 *   value={startDate}
 *   onChange={setStartDate}
 *   placeholder="Select Date"
 * />
 */
export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select date",
      type = "date",
      className = "",
      error,
      minDate,
      maxDate,
      disabled = false,
      id,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const getDateFormat = () => {
      if (type === "date") return "dd-MM-yyyy";
      if (type === "time") return "hh:mm aa";
      return "dd-MM-yyyy hh:mm aa";
    };

    const showTimeSelect = type === "time";
    const showTimeSelectOnly = type === "time";

    return (
      <div className="bdatetime position-relative">
        <DatePicker
          selected={value}
          onChange={onChange}
          dateFormat={getDateFormat()}
          showTimeSelect={showTimeSelect}
          showTimeSelectOnly={showTimeSelectOnly}
          timeIntervals={5}
          timeCaption="Time"
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          customInput={
            <CustomInput
              type={type}
              disabled={disabled}
              placeholder={placeholder}
              className={className}
              id={id}
              ref={ref}
            />
          }
          wrapperClassName="w-100"
          calendarClassName="bootstrap-datetimepicker-widget"
          popperClassName="bdatetime-popper"
          open={isOpen}
          onClickOutside={() => setIsOpen(false)}
          onInputClick={() => !disabled && setIsOpen(true)}
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => {
            const months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];

            return (
              <div className="react-datepicker__header-custom">
                <button
                  type="button"
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  className="react-datepicker__navigation react-datepicker__navigation--previous"
                >
                  <i className="fa fa-angle-left"></i>
                </button>
                <div className="react-datepicker__current-month">
                  {months[date.getMonth()]} {date.getFullYear()}
                </div>
                <button
                  type="button"
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  className="react-datepicker__navigation react-datepicker__navigation--next"
                >
                  <i className="fa fa-angle-right"></i>
                </button>
              </div>
            );
          }}
        />
        {error && <span className="text-danger text-sm mt-1">{error}</span>}
      </div>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";

export default DateTimePicker;
