"use client";

import { forwardRef, useEffect, useRef, useState } from "react";

import clsx from "clsx";

import "./TimePicker.css";

export interface TimePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * Custom TimePicker component with increment/decrement controls
 *
 * @example
 * <TimePicker
 *   value={time}
 *   onChange={setTime}
 *   placeholder="Select Time"
 * />
 */
export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select Time",
      className = "",
      error,
      disabled = false,
      id,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    // Derive values from props instead of using separate state
    const hours = value ? value.getHours() % 12 || 12 : 1;
    const minutes = value ? value.getMinutes() : 0;
    const period: "AM" | "PM" = value && value.getHours() >= 12 ? "PM" : "AM";

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatTime = (date: Date | null) => {
      if (!date) return "";
      const h = date.getHours() % 12 || 12;
      const m = String(date.getMinutes()).padStart(2, "0");
      const p = date.getHours() >= 12 ? "PM" : "AM";
      return `${String(h).padStart(2, "0")}:${m} ${p}`;
    };

    const updateTime = (
      newHours: number,
      newMinutes: number,
      newPeriod: "AM" | "PM"
    ) => {
      let hour24 = newHours;
      if (newPeriod === "PM" && newHours !== 12) hour24 += 12;
      if (newPeriod === "AM" && newHours === 12) hour24 = 0;

      const newDate = new Date();
      newDate.setHours(hour24, newMinutes, 0, 0);
      onChange(newDate);
    };

    const incrementHour = () => {
      const newHours = hours === 12 ? 1 : hours + 1;
      updateTime(newHours, minutes, period);
    };

    const decrementHour = () => {
      const newHours = hours === 1 ? 12 : hours - 1;
      updateTime(newHours, minutes, period);
    };

    const incrementMinute = () => {
      const newMinutes = minutes === 55 ? 0 : minutes + 5;
      updateTime(hours, newMinutes, period);
    };

    const decrementMinute = () => {
      const newMinutes = minutes === 0 ? 55 : minutes - 5;
      updateTime(hours, newMinutes, period);
    };

    const togglePeriod = () => {
      const newPeriod = period === "AM" ? "PM" : "AM";
      updateTime(hours, minutes, newPeriod);
    };

    return (
      <div ref={wrapperRef} className="timepicker-custom position-relative">
        <div className="position-relative">
          <input
            ref={ref}
            type="text"
            id={id}
            className={clsx("form-control border", className)}
            value={formatTime(value || null)}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            placeholder={placeholder}
            readOnly
            disabled={disabled}
          />
          <span
            className="position-absolute top-50 end-0 translate-middle-y me-3 pointer-events-none"
          >
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
          </span>
        </div>

        {isOpen && (
          <div className="timepicker-dropdown">
            <div className="timepicker-controls">
              <div className="timepicker-column">
                <button
                  type="button"
                  className="timepicker-btn timepicker-btn-up"
                  onClick={incrementHour}
                >
                  <i className="fa fa-chevron-up"></i>
                </button>
                <div className="timepicker-value">
                  {String(hours).padStart(2, "0")}
                </div>
                <button
                  type="button"
                  className="timepicker-btn timepicker-btn-down"
                  onClick={decrementHour}
                >
                  <i className="fa fa-chevron-down"></i>
                </button>
              </div>

              <div className="timepicker-separator">:</div>

              <div className="timepicker-column">
                <button
                  type="button"
                  className="timepicker-btn timepicker-btn-up"
                  onClick={incrementMinute}
                >
                  <i className="fa fa-chevron-up"></i>
                </button>
                <div className="timepicker-value">
                  {String(minutes).padStart(2, "0")}
                </div>
                <button
                  type="button"
                  className="timepicker-btn timepicker-btn-down"
                  onClick={decrementMinute}
                >
                  <i className="fa fa-chevron-down"></i>
                </button>
              </div>

              <button
                type="button"
                className={clsx(
                  "timepicker-period",
                  period === "PM" && "active"
                )}
                onClick={togglePeriod}
              >
                {period}
              </button>
            </div>
          </div>
        )}

        {error && <span className="text-danger text-sm mt-1">{error}</span>}
      </div>
    );
  }
);

TimePicker.displayName = "TimePicker";

export default TimePicker;
