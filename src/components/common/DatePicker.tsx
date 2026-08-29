import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FaCaretDown,
  FaCaretUp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";

import Button from "./Button";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import {
  compareDate,
  convertToDateString,
  generateCalendarDays,
  type CalendarDaysArrayFormat,
  type DateFormat,
} from "../../utils/dateUtils";

interface DatePickerProps {
  value: Date;
  onChange?: React.Dispatch<React.SetStateAction<Date>>;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  id?: string;
  format?: DateFormat;
}

type DateSegment = "day" | "month" | "year";
type ViewMode = null | "month" | "year";

const DAYS = ["PON", "UTO", "SRI", "ČET", "PET", "SUB", "NED"] as const;

const MONTHS = [
  "Siječanj",
  "Veljača",
  "Ožujak",
  "Travanj",
  "Svibanj",
  "Lipanj",
  "Srpanj",
  "Kolovoz",
  "Rujan",
  "Listopad",
  "Studeni",
  "Prosinac",
] as const;

const clampDateToBounds = (date: Date, min?: Date, max?: Date): Date | null => {
  if (min && compareDate("day", date, min, "less")) {
    return min;
  }

  if (max && compareDate("day", date, max, "greater")) {
    return max;
  }

  return date;
};

const isDateDisabled = (date: Date, min?: Date, max?: Date): boolean =>
  Boolean(
    (min && compareDate("day", date, min, "less")) ||
    (max && compareDate("day", date, max, "greater")),
  );

const isSameDay = (first: Date, second: Date): boolean =>
  first.toDateString() === second.toDateString();

const DatePicker: React.FC<DatePickerProps> = React.memo(
  ({
    value,
    onChange,
    min,
    max,
    disabled = false,
    id,
    format = "DD.MM.YYYY",
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>(null);

    const datePickerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    const selectedDayRef = useRef<HTMLButtonElement>(null);
    const selectedMonthRef = useRef<HTMLButtonElement>(null);
    const selectedYearRef = useRef<HTMLButtonElement>(null);

    const isPreviousDayDisabled =
      disabled ||
      Boolean(max && compareDate("day", value, max, "greaterOrEqual"));

    const isNextDayDisabled =
      disabled || Boolean(min && compareDate("day", value, min, "lessOrEqual"));

    const resetDatePickerState = useCallback(() => {
      setViewMode(null);
      setIsOpen(false);
    }, []);

    const updateDate = useCallback(
      (segment: DateSegment, amount: number) => {
        onChange?.((currentDate) => {
          const newDate = new Date(currentDate);

          switch (segment) {
            case "day":
              newDate.setDate(newDate.getDate() + amount);
              break;

            case "month":
              newDate.setMonth(newDate.getMonth() + amount);
              break;

            case "year":
              newDate.setFullYear(newDate.getFullYear() + amount);
              break;
          }

          return clampDateToBounds(newDate, min, max) ?? currentDate;
        });
      },
      [onChange, min, max],
    );

    const handleKeyDown = useCallback(
      (segment: DateSegment, event: React.KeyboardEvent<HTMLElement>): void => {
        switch (event.key) {
          case "Enter":
          case " ":
            if (event.currentTarget instanceof HTMLInputElement) {
              event.preventDefault();

              setIsOpen((previousOpen) => {
                if (!previousOpen) {
                  setViewMode(null);
                }

                return !previousOpen;
              });
            }

            break;

          case "ArrowUp":
            event.preventDefault();
            event.currentTarget instanceof HTMLInputElement
              ? updateDate(segment, 1)
              : updateDate(segment, segment === "day" ? -7 : -3);
            break;

          case "ArrowDown":
            event.preventDefault();
            event.currentTarget instanceof HTMLInputElement
              ? updateDate(segment, -1)
              : updateDate(segment, segment === "day" ? 7 : 3);
            break;

          case "ArrowLeft":
            event.preventDefault();
            updateDate(segment, -1);
            break;

          case "ArrowRight":
            event.preventDefault();
            updateDate(segment, 1);
            break;

          case "Escape":
            event.preventDefault();

            if (!(event.currentTarget instanceof HTMLInputElement)) {
              inputRef.current?.focus();
              resetDatePickerState();
            }

            break;
        }
      },
      [updateDate, resetDatePickerState],
    );

    const toggleDatePicker = useCallback(() => {
      setIsOpen((previousOpen) => {
        if (!previousOpen) {
          setViewMode(null);
        }

        return !previousOpen;
      });
    }, []);

    const toggleViewMode = useCallback((mode: "month" | "year") => {
      setViewMode((previousMode) => (previousMode === mode ? null : mode));
    }, []);

    const selectDate = useCallback(
      (date: Date) => {
        onChange?.(date);
        resetDatePickerState();
        inputRef.current?.focus();
      },
      [onChange, resetDatePickerState],
    );

    const selectMonth = useCallback(
      (month: number) => {
        onChange?.((currentDate) => {
          const newDate = new Date(currentDate);
          newDate.setMonth(month);

          return clampDateToBounds(newDate, min, max) ?? currentDate;
        });

        setViewMode(null);
      },
      [onChange, min, max],
    );

    const selectYear = useCallback(
      (year: number) => {
        onChange?.((currentDate) => {
          const newDate = new Date(currentDate);
          newDate.setFullYear(year);

          return clampDateToBounds(newDate, min, max) ?? currentDate;
        });

        setViewMode(null);
      },
      [onChange, min, max],
    );

    const calendarDays = useMemo(
      () => generateCalendarDays(value.getMonth(), value.getFullYear()),
      [value],
    );

    const years = useMemo(() => {
      const currentYear = new Date().getFullYear();
      const startYear = min ? min.getFullYear() - 5 : currentYear - 100;
      const endYear = max ? max.getFullYear() + 4 : currentYear + 20;

      return Array.from(
        { length: endYear - startYear + 1 },
        (_, index) => startYear + index,
      );
    }, [min, max]);

    useOutsideClick(datePickerRef, resetDatePickerState);

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      const selectedElement =
        viewMode === "year"
          ? selectedYearRef.current
          : viewMode === "month"
            ? selectedMonthRef.current
            : selectedDayRef.current;

      selectedElement?.focus();
    }, [isOpen, viewMode, value]);

    useEffect(() => {
      if (viewMode !== "year" || !selectedYearRef.current) {
        return;
      }

      const frame = requestAnimationFrame(() => {
        selectedYearRef.current?.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      });

      return () => cancelAnimationFrame(frame);
    }, [viewMode]);

    const today = useMemo(() => new Date(), []);

    const dayButtons = calendarDays.map(
      (item: CalendarDaysArrayFormat, index: number) => {
        const date = item.dateValue as Date;
        const isSelected = isSameDay(date, value);
        const isToday = isSameDay(date, today);
        const isDisabled = isDateDisabled(date, min, max);

        return (
          <button
            key={`${date.getTime()}-${index}`}
            ref={isSelected ? selectedDayRef : undefined}
            type="button"
            role="gridcell"
            tabIndex={isSelected && !viewMode ? 0 : -1}
            aria-label={date.toLocaleDateString("hr-HR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            aria-selected={isSelected}
            aria-current={isToday ? "date" : undefined}
            disabled={isDisabled}
            onClick={() => selectDate(date)}
            onKeyDown={(event) => handleKeyDown("day", event)}
            className={`aspect-square cursor-pointer rounded-sm border-none
              outline-none transition inset-ring-2
              focus:inset-ring-red-800
              disabled:cursor-not-allowed disabled:bg-gray-200
              disabled:text-gray-400 disabled:rounded-none
              ${
                isToday
                  ? "inset-ring-red-500 text-red-500"
                  : "inset-ring-transparent"
              }
              ${
                item.isActiveMonth
                  ? "hover:bg-red-400 hover:text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-red-200 rounded-none"
              }
              ${isSelected ? "bg-red-600 text-white" : ""}`}
          >
            {item.value as number}
          </button>
        );
      },
    );

    const monthButtons = MONTHS.map((month, index) => {
      const isSelected = value.getMonth() === index;

      const monthDate = new Date(value.getFullYear(), index, 1);

      const isDisabled = Boolean(
        (min && compareDate("month", monthDate, min, "less")) ||
        (max && compareDate("month", monthDate, max, "greater")),
      );

      return (
        <button
          key={month}
          ref={isSelected ? selectedMonthRef : undefined}
          type="button"
          tabIndex={isSelected ? 0 : -1}
          aria-label={`Odaberi mjesec ${month}`}
          aria-pressed={isSelected}
          disabled={isDisabled}
          onClick={(event) => {
            event.stopPropagation();
            selectMonth(index);
          }}
          onKeyDown={(event) => handleKeyDown("month", event)}
          className={`rounded-sm p-3 cursor-pointer outline-none
            transition inset-ring-2 inset-ring-transparent
            focus:inset-ring-red-900
            hover:bg-red-400 hover:text-white
            disabled:cursor-not-allowed disabled:bg-gray-200
            disabled:text-gray-400 disabled:rounded-none
            ${isSelected ? "bg-red-600 text-white" : ""}`}
        >
          {month}
        </button>
      );
    });

    const yearButtons = years.map((year) => {
      const isSelected = value.getFullYear() === year;

      const yearDate = new Date(year, 0, 1);

      const isDisabled = Boolean(
        (min && compareDate("year", yearDate, min, "less")) ||
        (max && compareDate("year", yearDate, max, "greater")),
      );

      return (
        <button
          key={year}
          ref={isSelected ? selectedYearRef : undefined}
          type="button"
          tabIndex={isSelected ? 0 : -1}
          aria-label={`Odaberi godinu ${year}`}
          aria-pressed={isSelected}
          disabled={isDisabled}
          onClick={(event) => {
            event.stopPropagation();
            selectYear(year);
          }}
          onKeyDown={(event) => handleKeyDown("year", event)}
          className={`rounded-sm p-3 cursor-pointer outline-none
            transition inset-ring-2 inset-ring-transparent
            focus:inset-ring-red-900
            hover:bg-red-400 hover:text-white
            disabled:cursor-not-allowed disabled:bg-gray-200
            disabled:text-gray-400 disabled:rounded-none
            ${isSelected ? "bg-red-600 text-white" : ""}`}
        >
          {year}
        </button>
      );
    });

    return (
      <div ref={datePickerRef} className="relative flex-1 w-full">
        <div className="flex rounded-sm border border-gray-300 bg-white focus-within:ring-1 ring-red-300">
          <Button
            type="button"
            className="text-red-600 py-3 hover:bg-gray-100"
            onClick={() => {
              resetDatePickerState();
              updateDate("day", -1);
            }}
            aria-label="Odaberi prethodni dan"
            disabled={isNextDayDisabled}
          >
            <FaChevronLeft aria-hidden="true" />
          </Button>

          <input
            ref={inputRef}
            id={id}
            type="text"
            readOnly
            value={convertToDateString(value, format)}
            className="w-full cursor-pointer text-center outline-none"
            onClick={toggleDatePicker}
            onKeyDown={(event) => handleKeyDown("day", event)}
            aria-label="Odabrani datum"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls="calendar-dialog"
            aria-describedby="date-format-instruction"
          />

          <Button
            type="button"
            className="text-red-600 py-3 hover:bg-gray-100"
            onClick={() => {
              resetDatePickerState();
              updateDate("day", 1);
            }}
            aria-label="Odaberi sljedeći dan"
            disabled={isPreviousDayDisabled}
          >
            <FaChevronRight aria-hidden="true" />
          </Button>
        </div>

        <div id="date-format-instruction" className="sr-only">
          Format datuma: DD. MM. YYYY
        </div>

        <div
          className={`sm:absolute sm:top-full sm:bottom-auto left-0 right-0 sm:mt-0.5 sm:max-w-sm sm:mx-auto
            fixed top-0 bottom-0 z-50 flex items-center justify-center
            bg-black/40 sm:bg-black
            ${
              isOpen
                ? "visible opacity-100"
                : "invisible opacity-0 pointer-events-none"
            }`}
          onClick={(event) => {
            !calendarRef.current?.contains(event.target as Node) &&
              resetDatePickerState();
          }}
        >
          <div
            id="calendar-dialog"
            ref={calendarRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-title"
            hidden={!isOpen}
            className="flex w-full max-w-sm flex-col rounded-sm
              border border-gray-300 bg-white p-2 shadow-lg"
          >
            <h2 id="calendar-title" className="sr-only">
              Odabir datuma
            </h2>

            <div className="flex items-center justify-between p-0.5">
              <Button
                type="button"
                className="flex flex-1 items-center justify-between
                  text-red-600 hover:bg-gray-100 max-w-none"
                onClick={() => toggleViewMode("month")}
                aria-expanded={viewMode === "month"}
                aria-controls="calendar-months"
              >
                {MONTHS[value.getMonth()]}
                {viewMode === "month" ? (
                  <FaCaretUp aria-hidden="true" />
                ) : (
                  <FaCaretDown aria-hidden="true" />
                )}
              </Button>

              <Button
                type="button"
                className="flex flex-1 items-center justify-between
                  text-red-600 hover:bg-gray-100 max-w-none"
                onClick={() => toggleViewMode("year")}
                aria-expanded={viewMode === "year"}
                aria-controls="calendar-years"
              >
                {value.getFullYear()}
                {viewMode === "year" ? (
                  <FaCaretUp aria-hidden="true" />
                ) : (
                  <FaCaretDown aria-hidden="true" />
                )}
              </Button>
            </div>

            <div className="relative">
              <div
                role="grid"
                aria-label={`${MONTHS[value.getMonth()]} ${value.getFullYear()}`}
              >
                <div
                  role="row"
                  className="grid grid-cols-7 border-b border-gray-300 p-0.5"
                >
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      role="columnheader"
                      aria-label={day}
                      className="pointer-events-none mt-3 mb-2 text-center
                        text-red-600 font-bold"
                    >
                      <span aria-hidden="true">{day}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 overflow-hidden rounded-sm p-0.5">
                  {dayButtons}
                </div>
              </div>

              {viewMode && (
                <div
                  id={
                    viewMode === "month" ? "calendar-months" : "calendar-years"
                  }
                  className="absolute inset-0 grid grid-cols-3
                    items-center overflow-auto bg-white"
                >
                  {viewMode === "month" ? monthButtons : yearButtons}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default DatePicker;
