import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import Button from "./Button";

import { DatePickerProps } from "../interfaces/components";

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [calendarIsOpen, setCalendarIsOpen] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event.target.value);
    console.log(value);
  };

  const handleClick = () => {
    setCalendarIsOpen((prevState) => !prevState);
  };

  return (
    <div
      className="focus-within:ring-1 rounded-sm flex border w-full max-w-sm relative"
      onClick={handleClick}
    >
      {!disabled && (
        <Button primary className="px-2">
          <FaChevronLeft />
        </Button>
      )}

      <input
        type="date"
        name=""
        id=""
        value={value && value}
        className="hide-calendar-icon outline-none p-2 text-center flex-1"
        disabled={disabled}
        onChange={handleChange}
      />

      {!disabled && (
        <Button primary className="px-2">
          <FaChevronRight />
        </Button>
      )}

      {calendarIsOpen && "hello"}
    </div>
  );
};

export default DatePicker;
