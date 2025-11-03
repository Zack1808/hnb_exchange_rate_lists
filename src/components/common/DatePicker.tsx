import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCaretUp,
  FaCaretDown,
} from "react-icons/fa6";

import Button from "./Button";

import { useOutsideClick } from "../../hooks/useOutsideClick";

import {
  convertToDateString,
  compareDate,
  generateCalendarDays,
  type DateFormat,
  type CalendarDaysArrayFormat,
} from "../../utils/dateUtils";

interface DatePickerProps {
  value: Date;
  onChange?: React.Dispatch<React.SetStateAction<Date>>;
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
const MONTHS = [
  "Sječanj",
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
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectYearOrMonth, setSelectYearOrMonth] = useState<
      null | "month" | "year"
    >(null);

    const datePickerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollToSelectedYearRef = useRef<HTMLDivElement>(null);
    const selectedDayRef = useRef<HTMLButtonElement>(null);
    const selectedMonthRef = useRef<HTMLButtonElement>(null);
    const selectedYearRef = useRef<HTMLButtonElement>(null);

    const incrementDisabled = useMemo(() => {
      const maxDisabled =
        max && compareDate("day", value, max, "greaterOrEqual");
      return disabled || maxDisabled;
    }, [max, value]);

    const decrementDisabled = useMemo(() => {
      const minDisabled = min && compareDate("day", value, min, "lessOrEqual");
      return disabled || minDisabled;
    }, [min, value]);

    const resetDatePickerState = useCallback((): void => {
      setSelectYearOrMonth(null);
      setIsOpen(false);
    }, []);

    const handleKeyPress = useCallback(
      (
        element: string,
        segment: "day" | "month" | "year",
        event: React.KeyboardEvent
      ): void => {
        switch (event.key) {
          case "Enter":
          case " ":
            if (element === "button") break;
            if (element === "input") {
              event.preventDefault();
              setIsOpen((prevState) => {
                !prevState && setSelectYearOrMonth(null);
                return !prevState;
              });
              break;
            }
            break;
          case "ArrowUp":
            event.preventDefault();
            if (element === "button") {
              updateDate(segment, segment === "day" ? -7 : -3);
              break;
            }
            if (element === "input") {
              updateDate("day", 1);
              break;
            }
            break;
          case "ArrowDown":
            event.preventDefault();
            if (element === "button") {
              updateDate(segment, segment === "day" ? 7 : 3);
              break;
            }
            if (element === "input") {
              updateDate("day", -1);
              break;
            }
            break;
          case "ArrowLeft":
            event.preventDefault();
            if (element === "button") {
              updateDate(segment, -1);
              break;
            }
            if (element === "input") break;
            break;
          case "ArrowRight":
            event.preventDefault();
            if (element === "button") {
              updateDate(segment, 1);
              break;
            }
            if (element === "input") break;
            break;
          case "Escape":
            event.preventDefault();
            if (element === "button") {
              inputRef.current?.focus();
              resetDatePickerState();
              break;
            }
            if (element === "input") break;
            break;
        }
      },
      []
    );

    const updateDate = useCallback(
      (dateSegment: "day" | "month" | "year", ammount: number): void => {
        onChange?.((prevState) => {
          const newDate = new Date(prevState);

          switch (dateSegment) {
            case "day":
              newDate.setDate(newDate.getDate() + ammount);
              break;
            case "month":
              newDate.setMonth(newDate.getMonth() + ammount);
              break;
            case "year":
              newDate.setFullYear(newDate.getFullYear() + ammount);
              break;
          }

          return min && compareDate("month", newDate, min, "less")
            ? prevState
            : min && compareDate("day", newDate, min, "less")
            ? min
            : max && compareDate("month", newDate, max, "greater")
            ? prevState
            : max && compareDate("day", newDate, max, "greater")
            ? max
            : newDate;
        });
      },
      [onChange]
    );

    const handleToggleDatePicker = useCallback(
      (event: React.MouseEvent): void => {
        event.stopPropagation();

        setIsOpen((prevState) => {
          !prevState && setSelectYearOrMonth(null);
          return !prevState;
        });
      },
      []
    );

    const handleInputKeypressToggleDatePicker = useCallback(
      (event: React.KeyboardEvent): void => {
        const element = (event.target as HTMLElement).tagName.toLowerCase();

        handleKeyPress(element, "day", event);
      },
      []
    );

    const handleYearOrMonthButtonClick = useCallback(
      (selection: "month" | "year"): void => {
        setSelectYearOrMonth((prevState) => {
          return prevState === selection ? null : selection;
        });
      },
      []
    );

    const incrementDate = useCallback((): void => {
      resetDatePickerState();
      updateDate("day", 1);
    }, [resetDatePickerState, updateDate]);

    const decrementDate = useCallback((): void => {
      resetDatePickerState();
      updateDate("day", -1);
    }, [resetDatePickerState, updateDate]);

    const generateDayButtons = useCallback((): React.ReactNode => {
      const month = value.getMonth();
      const year = value.getFullYear();

      const days = generateCalendarDays(month, year);

      const handleClick = (date: Date): void => {
        onChange?.(date);
        resetDatePickerState();
        inputRef.current?.focus();
      };

      const handlePress = (event: React.KeyboardEvent): void => {
        const element = (event.target as HTMLElement).tagName.toLowerCase();
        handleKeyPress(element, "day", event);
      };

      return days.map((item: CalendarDaysArrayFormat, index: number) => {
        const isSelected =
          item.dateValue.toDateString() === value.toDateString();
        const isToday =
          item.dateValue.toDateString() === new Date().toDateString();
        const isDisabled =
          (min && compareDate("day", item.dateValue, min, "less")) ||
          (max && compareDate("day", item.dateValue, max, "greater"));

        return (
          <button
            type="button"
            key={index}
            ref={isSelected ? selectedDayRef : null}
            tabIndex={isSelected && !selectYearOrMonth ? 0 : -1}
            aria-label={(item.dateValue as Date).toDateString()}
            aria-selected={isSelected}
            onClick={() => handleClick(item.dateValue as Date)}
            onKeyDown={handlePress}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className={`aspect-square cursor-pointer transition rounded-sm outline-none border-none inset-ring-3 focus:inset-ring-red-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:rounded-none ${
              isToday
                ? " inset-ring-red-500 text-red-500"
                : "inset-ring-transparent"
            } ${
              item.isActiveMonth
                ? "hover:bg-red-400 hover:text-white"
                : "bg-gray-50 text-gray-500 hover:bg-red-200 rounded-none"
            } ${isSelected ? "bg-red-600 text-white" : ""}`}
          >
            {item.value as number}
          </button>
        );
      });
    }, [value, onChange, resetDatePickerState, selectYearOrMonth]);

    const generateMonthButtons = useCallback((): React.ReactNode => {
      const handleClick = (index: number, event: React.MouseEvent): void => {
        event.stopPropagation();

        onChange?.((prevState: Date) => {
          const newDate = new Date(prevState);
          newDate.setMonth(index);

          return newDate;
        });

        setSelectYearOrMonth(null);
      };

      const handlePress = (event: React.KeyboardEvent) => {
        const element = (event.target as HTMLElement).tagName.toLowerCase();
        handleKeyPress(element, "month", event);
      };

      return MONTHS.map((month: string, index: number) => {
        const isSelected = value.getMonth() === index;
        const isDisabled =
          (min &&
            compareDate(
              "month",
              new Date(value.getFullYear(), index, 1),
              min,
              "less"
            )) ||
          (max &&
            compareDate(
              "month",
              new Date(value.getFullYear(), index, 1),
              max,
              "greater"
            ));

        return (
          <button
            type="button"
            key={month}
            ref={isSelected ? selectedMonthRef : null}
            tabIndex={isSelected ? 0 : -1}
            aria-label={month}
            aria-selected={isSelected}
            className={`hover:bg-red-400 rounded-sm hover:text-white p-3 cursor-pointer outline-none transition inset-ring-3 inset-ring-transparent focus:inset-ring-red-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:rounded-none ${
              isSelected ? "bg-red-600 text-white" : ""
            }`}
            onClick={(event) => handleClick(index, event)}
            onKeyDown={handlePress}
            disabled={isDisabled}
            aria-disabled={isDisabled}
          >
            {month}
          </button>
        );
      });
    }, [value, onChange]);

    const generateYearButtons = useCallback((): React.ReactNode => {
      const currentYear = new Date().getFullYear();
      const startYear = min ? min.getFullYear() - 5 : currentYear - 100;
      const endYear = max ? max.getFullYear() + 4 : currentYear + 20;

      let years: number[] = [];

      for (let i = startYear; i <= endYear; i++) years.push(i);

      const handleClick = (value: number, event: React.MouseEvent): void => {
        event.stopPropagation();

        onChange?.((prevState: Date) => {
          const newDate = new Date(prevState);
          newDate.setFullYear(value);

          return min && compareDate("day", newDate, min, "less")
            ? min
            : max && compareDate("day", newDate, max, "greater")
            ? max
            : newDate;
        });

        setSelectYearOrMonth(null);
      };

      const handlePress = (event: React.KeyboardEvent): void => {
        const element = (
          event.target as HTMLElement
        ).tagName.toLocaleLowerCase();
        handleKeyPress(element, "year", event);
      };

      return years.map((year: number) => {
        const isSelected = value.getFullYear() === year;
        const isDisabled =
          (min && compareDate("year", new Date(year, 0, 1), min, "less")) ||
          (max && compareDate("year", new Date(year, 0, 1), max, "greater"));

        return (
          <button
            type="button"
            key={year}
            ref={isSelected ? selectedYearRef : null}
            tabIndex={isSelected ? 0 : -1}
            aria-label={String(year)}
            aria-selected={isSelected}
            onClick={(event) => handleClick(year, event)}
            onKeyDown={handlePress}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className={`hover:bg-red-400 rounded-sm hover:text-white p-3 cursor-pointer outline-none transition inset-ring-3 inset-ring-transparent focus:inset-ring-red-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:rounded-none ${
              isSelected ? "bg-red-600 text-white" : ""
            }`}
          >
            {year}
          </button>
        );
      });
    }, [selectYearOrMonth, value, onChange]);

    useOutsideClick(datePickerRef, resetDatePickerState);

    useEffect(() => {
      if (selectYearOrMonth !== "year" || !scrollToSelectedYearRef.current)
        return;

      setTimeout(() => {
        const selectedYearElement =
          scrollToSelectedYearRef.current?.querySelector(".bg-red-600");
        if (selectedYearElement) {
          selectedYearElement.scrollIntoView({
            behavior: "instant",
            block: "center",
            inline: "center",
          });
        }
      }, 10);
    }, [selectYearOrMonth]);

    useEffect(() => {
      if (!isOpen) return;
      if (!selectYearOrMonth) selectedDayRef.current?.focus();
      if (selectYearOrMonth === "month") selectedMonthRef.current?.focus();
      if (selectYearOrMonth === "year") selectedYearRef.current?.focus();
    }, [isOpen, selectYearOrMonth, value]);

    return (
      <div className="relative flex-1">
        <div className="flex border border-gray-300 bg-white rounded-sm focus-within:ring-1 ring-red-300">
          <Button
            className="text-red-600 py-3 hover:bg-gray-100"
            onClick={decrementDate}
            aria-label="Odaberi prijašnji dan"
            disabled={decrementDisabled}
            aria-disabled={decrementDisabled}
            type="button"
          >
            <FaChevronLeft />
          </Button>
          <input
            type="text"
            readOnly
            ref={inputRef}
            value={convertToDateString(value, format)}
            className="outline-none cursor-pointer text-center w-full"
            onClick={handleToggleDatePicker}
            onKeyDown={handleInputKeypressToggleDatePicker}
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
            disabled={incrementDisabled}
            aria-disabled={incrementDisabled}
            type="button"
          >
            <FaChevronRight />
          </Button>
        </div>

        <div id="date-format-instruction" className="sr-only">
          Format Datuma: DD. MM. YYYY
        </div>

        <div
          className={`sm:absolute fixed sm:top-full sm:bottom-auto top-0 bottom-0 right-0 left-0 sm:mt-0.5 bg-black/40 sm:bg-transparent z-50 flex justify-center items-center ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div
            ref={datePickerRef}
            className="flex flex-col bg-white border border-gray-300 rounded-sm w-full max-w-sm transition shadow-lg p-2"
            role="dialog"
            aria-modal="true"
            aria-label="Kalendar"
            hidden={!isOpen}
          >
            <div className="flex items-center justify-between p-0.5">
              <Button
                type="button"
                className="text-red-600 max-w-none flex-1 flex items-center justify-between hover:bg-gray-100"
                onClick={() => handleYearOrMonthButtonClick("month")}
              >
                {MONTHS[value.getMonth()]}{" "}
                {selectYearOrMonth === "month" ? (
                  <FaCaretUp />
                ) : (
                  <FaCaretDown />
                )}
              </Button>
              <Button
                type="button"
                className="text-red-600 max-w-none flex-1 flex items-center justify-between hover:bg-gray-100"
                onClick={() => handleYearOrMonthButtonClick("year")}
              >
                {value.getFullYear()}{" "}
                {selectYearOrMonth === "year" ? <FaCaretUp /> : <FaCaretDown />}
              </Button>
            </div>

            <div className="relative">
              <div className="flex-1">
                <div className="grid grid-cols-7 border-b border-gray-300 p-0.5">
                  {DAYS.map((day: string) => (
                    <small
                      className="text-red-600 font-bold text-center pointer-events-none mt-3 mb-2"
                      key={day}
                    >
                      {day}
                    </small>
                  ))}
                </div>
                <div className="grid grid-cols-7 rounded-sm overflow-hidden p-0.5">
                  {generateDayButtons()}
                </div>
              </div>

              {selectYearOrMonth ? (
                <div
                  className="absolute inset-0 bg-white grid grid-cols-3 items-center overflow-auto"
                  ref={scrollToSelectedYearRef}
                >
                  {selectYearOrMonth === "month"
                    ? generateMonthButtons()
                    : generateYearButtons()}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default DatePicker;
