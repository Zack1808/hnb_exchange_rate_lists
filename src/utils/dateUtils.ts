export type DateFormat =
  | "YYYY-MM-DD"
  | "YYYY.MM.DD"
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "DD-MM-YYYY"
  | "MM-DD-YYYY"
  | "YYYY/MM/DD"
  | "DD.MM.YYYY"
  | "MM.DD.YYYY";

type OperationFormat =
  | "same"
  | "greater"
  | "less"
  | "greaterOrEqual"
  | "lessOrEqual";

export interface CalendarDaysArrayFormat {
  value: number;
  isActiveMonth: boolean;
  dateValue: Date;
}

export const compareDate = (
  compare: "day" | "month" | "year",
  date1: Date,
  date2: Date,
  operation: OperationFormat
): boolean => {
  switch (compare) {
    case "day":
      return compareDays(date1, date2, operation);
    case "month":
      return compareMonths(date1, date2, operation);
    case "year":
      return compareYears(date1, date2, operation);
    default:
      return false;
  }
};

const compareDays = (
  date1: Date,
  date2: Date,
  operation: OperationFormat
): boolean => {
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
        compareDays(date1, date2, "same") ||
        compareDays(date1, date2, "greater")
      );

    case "lessOrEqual":
      return (
        compareDays(date1, date2, "same") || compareDays(date1, date2, "less")
      );
  }
};

const compareMonths = (
  date1: Date,
  date2: Date,
  operation: OperationFormat
): boolean => {
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
      return (
        compareMonths(date1, date2, "same") ||
        compareMonths(date1, date2, "greater")
      );

    case "lessOrEqual":
      return (
        compareMonths(date1, date2, "same") ||
        compareMonths(date1, date2, "less")
      );
  }
};

const compareYears = (
  date1: Date,
  date2: Date,
  operation: OperationFormat
): boolean => {
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
      return (
        compareYears(date1, date2, "same") ||
        compareYears(date1, date2, "greater")
      );

    case "lessOrEqual":
      return (
        compareYears(date1, date2, "same") || compareYears(date1, date2, "less")
      );
  }
};

export const convertToDateString = (date: Date, format: DateFormat): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear().toString();

  const newDate = format
    .replace("DD", day)
    .replace("MM", month)
    .replace("YYYY", year);

  return newDate;
};

export const generateCalendarDays = (
  month: number,
  year: number
): Array<CalendarDaysArrayFormat> => {
  const days: Array<CalendarDaysArrayFormat> = [];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const firstDayMondayBased = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  const currMonthDaysAmount = new Date(year, month + 1, 0).getDate();

  for (let i = firstDayMondayBased - 1; i >= 0; i--) {
    days.push({
      value: prevMonthLastDate - i,
      isActiveMonth: false,
      dateValue: new Date(year, month - 1, prevMonthLastDate - i),
    });
  }

  for (let i = 1; i <= currMonthDaysAmount; i++) {
    days.push({
      value: i,
      isActiveMonth: true,
      dateValue: new Date(year, month, i),
    });
  }

  const totalDaysShown = days.length;
  const nextMonthDaysAmount = 42 - totalDaysShown;
  for (let i = 1; i <= nextMonthDaysAmount; i++) {
    days.push({
      value: i,
      isActiveMonth: false,
      dateValue: new Date(year, month + 1, i),
    });
  }

  return days;
};
