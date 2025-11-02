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

type OperationFormat =
  | "same"
  | "greater"
  | "less"
  | "greaterOrEqual"
  | "lessOrEqual";

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

    const compareDates = useCallback(
      (date1: Date, date2: Date, operation: OperationFormat): boolean => {
        const year1 = date1.getFullYear();
        const year2 = date2.getFullYear();
        const month1 = date1.getMonth();
        const month2 = date2.getMonth();
        const day1 = date1.getDate();
        const day2 = date2.getDate();

        switch (operation) {
          case "same":
            return year1 === year2 && month1 === month2 && day1 === day2;

          case "greater":
            return (
              year1 > year2 ||
              (year1 === year2 && month1 > month2) ||
              (year1 === year2 && month1 === month2 && day1 > day2)
            );

          case "less":
            return (
              year1 < year2 ||
              (year1 === year2 && month1 < month2) ||
              (year1 === year2 && month1 === month2 && day1 < day2)
            );

          case "greaterOrEqual":
            return (
              compareDates(date1, date2, "same") ||
              compareDates(date1, date2, "greater")
            );

          case "lessOrEqual":
            return (
              compareDates(date1, date2, "same") ||
              compareDates(date1, date2, "less")
            );
        }
      },
      []
    );

    const compareMonths = useCallback(
      (date1: Date, date2: Date, operation: OperationFormat): boolean => {
        const year1 = date1.getFullYear();
        const year2 = date2.getFullYear();
        const month1 = date1.getMonth();
        const month2 = date2.getMonth();

        switch (operation) {
          case "same":
            return year1 === year2 && month1 === month2;

          case "greater":
            return year1 > year2 || (year1 === year2 && month1 > month2);

          case "less":
            return year1 < year2 || (year1 === year2 && month1 < month2);

          case "greaterOrEqual":
            return year1 > year2 || (year1 === year2 && month1 >= month2);

          case "lessOrEqual":
            return year1 < year2 || (year1 === year2 && month1 <= month2);
        }
      },
      []
    );

    const compareYears = useCallback(
      (date1: Date, date2: Date, operation: OperationFormat): boolean => {
        const year1 = date1.getFullYear();
        const year2 = date2.getFullYear();

        switch (operation) {
          case "same":
            return year1 === year2;

          case "greater":
            return year1 > year2;

          case "less":
            return year1 < year2;

          case "greaterOrEqual":
            return year1 >= year2;

          case "lessOrEqual":
            return year1 <= year2;
        }
      },
      []
    );

    const incrementDisabled = useMemo(() => {
      const maxDisabled = max && compareDates(value, max, "greaterOrEqual");
      return disabled || maxDisabled;
    }, [max, value]);

    const decrementDisabled = useMemo(() => {
      const minDisabled = min && compareDates(value, min, "lessOrEqual");
      return disabled || minDisabled;
    }, [min, value]);

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
      setSelectYearOrMonth(null);
      setIsOpen(false);
    }, []);

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

          return (min && compareDates(newDate, min, "less")) ||
            (max && compareDates(newDate, max, "greater"))
            ? prevState
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
        switch (event.key) {
          case "Enter":
          case " ":
            event.preventDefault();
            setIsOpen((prevState) => {
              !prevState && setSelectYearOrMonth(null);
              return !prevState;
            });
            break;
          case "ArrowUp":
            event.preventDefault();
            updateDate("day", 1);
            break;
          case "ArrowDown":
            event.preventDefault();
            updateDate("day", -1);
            break;
        }
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

      let days: Record<string, boolean | number | Date>[] = [];

      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const firstDayMondayBased =
        firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

      const prevMonthLastDate = new Date(year, month, 0).getDate();
      const currMonthDaysAmount = new Date(year, month + 1, 0).getDate();

      for (let i = firstDayMondayBased - 1; i >= 0; i--) {
        days = [
          ...days,
          {
            value: prevMonthLastDate - i,
            isActiveMonth: false,
            dateValue: new Date(year, month - 1, prevMonthLastDate - i),
          },
        ];
      }

      for (let i = 0; i < currMonthDaysAmount; i++) {
        days = [
          ...days,
          {
            value: i + 1,
            isActiveMonth: true,
            dateValue: new Date(year, month, i + 1),
          },
        ];
      }

      const totalDaysShown = days.length;
      const nextMonthDaysAmount = 42 - totalDaysShown;

      for (let i = 0; i < nextMonthDaysAmount; i++) {
        days = [
          ...days,
          {
            value: i + 1,
            isActiveMonth: false,
            dateValue: new Date(year, month + 1, i + 1),
          },
        ];
      }

      const handleClick = (date: Date): void => {
        onChange?.(date);
        resetDatePickerState();
        inputRef.current?.focus();
      };

      const handleKeyPress = (event: React.KeyboardEvent): void => {
        switch (event.key) {
          case "ArrowUp":
            event.preventDefault();
            updateDate("day", -7);
            break;
          case "ArrowDown":
            event.preventDefault();
            updateDate("day", 7);
            break;
          case "ArrowLeft":
            event.preventDefault();
            updateDate("day", -1);
            break;
          case "ArrowRight":
            event.preventDefault();
            updateDate("day", 1);
            break;
          case "Escape":
            resetDatePickerState();
            inputRef.current?.focus();
            break;
        }
      };

      return days.map(
        (item: Record<string, boolean | number | Date>, index: number) => {
          const isSelected =
            (item.dateValue as Date).toDateString() === value.toDateString();
          const isToday =
            (item.dateValue as Date).toDateString() ===
            new Date().toDateString();
          const isDisabled =
            (min && compareDates(item.dateValue as Date, min, "less")) ||
            (max && compareDates(item.dateValue as Date, max, "greater"));

          return (
            <button
              type="button"
              key={index}
              ref={isSelected ? selectedDayRef : null}
              tabIndex={isSelected && !selectYearOrMonth ? 0 : -1}
              aria-label={(item.dateValue as Date).toDateString()}
              aria-selected={
                (item.dateValue as Date).toDateString() === value.toDateString()
              }
              onClick={() => handleClick(item.dateValue as Date)}
              onKeyDown={handleKeyPress}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              className={`aspect-square cursor-pointer transition outline-none border-2 focus:!border-black disabled:bg-gray-400 disabled:text-white ${
                isToday ? " border-red-500 text-red-500" : "border-transparent"
              } ${
                item.isActiveMonth
                  ? "hover:bg-red-400 hover:text-white"
                  : "bg-gray-50 text-gray-400 hover:bg-red-200"
              } ${isSelected ? "bg-red-600 text-white" : ""}`}
            >
              {item.value as number}
            </button>
          );
        }
      );
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

      const handleKeyPress = (event: React.KeyboardEvent) => {
        switch (event.key) {
          case "ArrowUp":
            event.preventDefault();
            updateDate("month", -3);
            break;
          case "ArrowDown":
            event.preventDefault();
            updateDate("month", 3);
            break;
          case "ArrowLeft":
            event.preventDefault();
            updateDate("month", -1);
            break;
          case "ArrowRight":
            event.preventDefault();
            updateDate("month", 1);
            break;
          case "Escape":
            resetDatePickerState();
            inputRef.current?.focus();
            break;
        }
      };

      return MONTHS.map((month: string, index: number) => {
        const isSelected = value.getMonth() === index;
        const isDisabled =
          (min &&
            compareMonths(
              new Date(value.getFullYear(), index, 1),
              min,
              "less"
            )) ||
          (max &&
            compareMonths(
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
            aria-selected={index === value.getMonth()}
            className={`hover:bg-red-400 hover:text-white p-3 cursor-pointer transition border-2 border-transparent focus:border-black disabled:bg-gray-400 disabled:text-white ${
              isSelected ? "bg-red-600 text-white" : ""
            }`}
            onClick={(event) => handleClick(index, event)}
            onKeyDown={handleKeyPress}
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

          return newDate;
        });

        setSelectYearOrMonth(null);
      };

      const handleKeyPress = (event: React.KeyboardEvent): void => {
        switch (event.key) {
          case "ArrowUp":
            event.preventDefault();
            updateDate("year", -3);
            break;
          case "ArrowDown":
            event.preventDefault();
            updateDate("year", 3);
            break;
          case "ArrowLeft":
            event.preventDefault();
            updateDate("year", -1);
            break;
          case "ArrowRight":
            event.preventDefault();
            updateDate("year", 1);
            break;
          case "Escape":
            resetDatePickerState();
            inputRef.current?.focus();
            break;
        }
      };

      return years.map((year: number) => {
        const isSelected = value.getFullYear() === year;
        const isDisabled =
          (min && compareYears(new Date(year, 0, 1), min, "less")) ||
          (max && compareYears(new Date(year, 0, 1), max, "greater"));

        return (
          <button
            type="button"
            key={year}
            ref={isSelected ? selectedYearRef : null}
            tabIndex={isSelected ? 0 : -1}
            aria-label={String(year)}
            aria-selected={year === value.getFullYear()}
            onClick={(event) => handleClick(year, event)}
            onKeyDown={handleKeyPress}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className={`hover:bg-red-400 hover:text-white p-3 cursor-pointer transition border-2 border-transparent focus:border-black disabled:bg-gray-400 disabled:text-white ${
              isSelected ? "bg-red-600 text-white" : ""
            }`}
          >
            {year}
          </button>
        );
      });
    }, [selectYearOrMonth, value, onChange]);

    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent): void => {
        if (!datePickerRef.current?.contains(event.target as Node)) {
          resetDatePickerState();
        }
      };

      document.addEventListener("click", handleOutsideClick);

      return (): void => {
        document.removeEventListener("click", handleOutsideClick);
      };
    }, [resetDatePickerState]);

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
      <div className="relative">
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
