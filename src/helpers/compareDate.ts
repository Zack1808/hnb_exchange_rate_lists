type OperationFormat =
  | "same"
  | "greater"
  | "less"
  | "greaterOrEqual"
  | "lessOrEqual";

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
