import { ChangeDateByDaysProps } from "../interfaces/helpers";

const convertDateToString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0'");
  const day = String(date.getDate()).padStart(2, "0'");

  return `${year}-${month}-${day}`;
};

export const getFormatedCurrentDate = () => {
  const currentDate = new Date();

  return convertDateToString(currentDate);
};

export const changeDateByDays = ({
  date,
  daysAmount,
}: ChangeDateByDaysProps) => {
  const selectedDate = new Date(date);

  selectedDate.setDate(selectedDate.getDate() + daysAmount);

  return convertDateToString(selectedDate);
};
