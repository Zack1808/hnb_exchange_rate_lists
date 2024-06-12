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
  min,
  max,
  ...rest
}) => {
  const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!!!onChange) return;

    onChange(event.target.value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!!!onChange || !!!min || !!!max) return;
    if (event.target.value <= min) {
      onChange(min);
      return;
    }
    if (event.target.value >= max) {
      onChange(max);
      return;
    }
  };

  const increaseDate = () => {
    if (!!!value || !!!onChange) return;
    const date = changeDateByDays({ date: value, daysAmount: 1 });
    onChange(date);
  };

  const decreaseDate = () => {
    if (!!!value || !!!onChange) return;
    const date = changeDateByDays({ date: value, daysAmount: -1 });
    onChange(date);
  };

  return (
    <div
      className={`${
        disabled ? "" : "focus-within:ring-1"
      } rounded-sm flex border w-full max-w-sm relative`}
    >
      {!disabled && onChange && (
        <Button
          className="px-2 text-red-500"
          onClick={decreaseDate}
          disabled={value && min ? value <= min : false}
        >
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
        onBlur={handleBlur}
        min={min}
        max={max}
      />

      {!disabled && onChange && (
        <Button
          onClick={increaseDate}
          className="px-2 text-red-500"
          disabled={value && max ? value >= max : false}
        >
          <FaChevronRight />
        </Button>
      )}
    </div>
  );
};

export default DatePicker;
