import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import Button from "./Button";

import { changeDateByDays } from "../helpers/getFormatedDates";

import { DatePickerProps } from "../interfaces/components";

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled,
  className,
  ...rest
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event.target.value);
  };

  const increaseDate = () => {
    if (!!!value) return;
    const date = changeDateByDays({ date: value, daysAmount: 1 });
    onChange && onChange(date);
  };

  const decreaseDate = () => {
    if (!!!value) return;
    const date = changeDateByDays({ date: value, daysAmount: -1 });
    onChange && onChange(date);
  };

  return (
    <div
      className={`${
        disabled ? "" : "focus-within:ring-1"
      } rounded-sm flex border w-full max-w-sm relative`}
      tabIndex={0}
    >
      {!disabled && (
        <Button primary className="px-2" onClick={increaseDate}>
          <FaChevronLeft />
        </Button>
      )}

      <input
        {...rest}
        type="date"
        value={value && value}
        className="outline-none p-2 text-center flex-1"
        disabled={disabled}
        onChange={handleChange}
      />

      {!disabled && (
        <Button primary className="px-2" onClick={decreaseDate}>
          <FaChevronRight />
        </Button>
      )}
    </div>
  );
};

export default DatePicker;
