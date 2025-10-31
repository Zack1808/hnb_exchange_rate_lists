import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCaretUp,
  FaCaretDown,
} from "react-icons/fa6";

import Button from "./Button";

type DateFormat =
  | "YYYY-MM-DD"
  | "YYYY.MM.DD"
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "DD-MM-YYYY"
  | "MM-DD-YYYY"
  | "YYYY/MM/DD"
  | "DD.MM.YYYY"
  | "MM.DD.YYYY";

interface DatePickerProps {
  value: Date;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  id?: string;
  selectedRange?: {
    from: Date;
    to: Date;
  };
  format?: DateFormat;
}

const DAYS = ["PON", "UTO", "SRI", "ČET", "PET", "SUB", "NED"] as const;

const DatePicker: React.FC<DatePickerProps> = React.memo(
  ({
    value,
    onChange,
    min,
    max,
    disabled,
    id,
    selectedRange,
    format = "DD.MM.YYYY",
  }) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const datePickerRef = useRef<HTMLDivElement>(null);

    const convertToDateString = useCallback(
      (date: Date, format: DateFormat): string => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear().toString();

        const newDate = format
          .replace("DD", day)
          .replace("MM", month)
          .replace("YYYY", year);

        return newDate;
      },
      []
    );

    const resetDatePickerState = useCallback((): void => {
      isOpen && setIsOpen(false);
    }, [isOpen]);

    const handleToggleDatePicker = useCallback(
      (event: React.MouseEvent): void => {
        event.stopPropagation();

        setIsOpen((prevState) => !prevState);
      },
      []
    );

    const incrementDate = useCallback(() => {
      resetDatePickerState();
    }, [resetDatePickerState]);

    const decrementDate = useCallback(() => {
      resetDatePickerState();
    }, [resetDatePickerState]);

    const generateDayButtons = useCallback(() => {
      const month = value.getMonth();
      const year = value.getFullYear();

      let days: Record<string, boolean | number>[] = [];

      const prevMonthDaysAmount = new Date(year, month, 0).getDay();
      const currMonthDaysAmount = new Date(year, month + 1, 0).getDate();
      const nextMonthDaysAmount =
        42 - (prevMonthDaysAmount + currMonthDaysAmount);

      for (let i = 0; i < prevMonthDaysAmount; i++)
        days = [...days, { value: i + 1, isActiveMonth: false }];
      for (let i = 0; i < currMonthDaysAmount; i++)
        days = [...days, { value: i + 1, isActiveMonth: true }];
      for (let i = 0; i < nextMonthDaysAmount; i++)
        days = [...days, { value: i + 1, isActiveMonth: false }];

      return days.map(
        (item: Record<string, boolean | number>, index: number) => (
          <button
            type="button"
            key={index}
            className={`aspect-square cursor-pointer transition ${
              item.isActiveMonth
                ? "hover:bg-red-400"
                : "bg-gray-100 text-gray-400 hover:bg-red-200"
            }`}
          >
            {item.value}
          </button>
        )
      );
    }, [value]);

    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent): void => {
        if (!datePickerRef.current?.contains(event.target as Node))
          resetDatePickerState();
      };

      document.addEventListener("click", handleOutsideClick);

      return (): void => {
        document.removeEventListener("click", handleOutsideClick);
      };
    }, []);

    return (
      <div className="relative">
        <div className="flex border border-gray-300 bg-white rounded-sm focus-within:ring-1 ring-red-300">
          <Button
            className="text-red-600 py-3 hover:bg-gray-100"
            onClick={decrementDate}
            aria-label="Odaberi prijašnji dan"
            disabled={disabled}
            aria-disabled={disabled}
            type="button"
          >
            <FaChevronLeft />
          </Button>
          <input
            type="text"
            readOnly
            value={convertToDateString(value, format)}
            className="outline-none cursor-pointer text-center w-full"
            onClick={handleToggleDatePicker}
            aria-label="Odabrani datum"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls="calendar-dialog"
            aria-describedby="date-format-instruction"
            id={id}
          />
          <Button
            className="text-red-600 py-3 hover:bg-gray-100"
            onClick={incrementDate}
            aria-label="Odaberi slijedeći dan"
            disabled={disabled}
            aria-disabled={disabled}
            type="button"
          >
            <FaChevronRight />
          </Button>
        </div>

        <div id="date-format-instruction" className="sr-only">
          Format Datuma: DD. MM. YYYY
        </div>

        <div
          className={`absolute top-full right-0 left-0 mt-0.5 bg-black/40 sm:bg-transparent z-50 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div
            ref={datePickerRef}
            className="flex flex-col bg-white border border-gray-300  rounded-sm w-full transition shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Kalendar"
            hidden={!isOpen}
          >
            <div className="flex items-center justify-between">
              <Button
                type="button"
                className="text-red-600 max-w-none flex-1 flex items-center justify-between hover:bg-gray-100"
              >
                Listopad <FaCaretDown />
              </Button>
              <Button
                type="button"
                className="text-red-600 max-w-none flex-1 flex items-center justify-between hover:bg-gray-100"
              >
                2025
                <FaCaretDown />
              </Button>
            </div>

            <div className="p-2 relative">
              <div className="flex-1">
                <div className="grid grid-cols-7 border-b border-gray-300">
                  {DAYS.map((day: string) => (
                    <small
                      className="text-red-600 font-bold text-center pointer-events-none mt-3 mb-2"
                      key={day}
                    >
                      {day}
                    </small>
                  ))}
                </div>
                <div className="grid grid-cols-7">{generateDayButtons()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default DatePicker;
