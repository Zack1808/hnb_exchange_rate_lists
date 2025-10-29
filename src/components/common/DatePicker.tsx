import React, { useState, useCallback, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

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
            className="relative flex flex-col bg-white border border-gray-300 p-3 rounded-sm w-full transition shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Kalendar"
            hidden={!isOpen}
          ></div>
        </div>
      </div>
    );
  }
);

export default DatePicker;
