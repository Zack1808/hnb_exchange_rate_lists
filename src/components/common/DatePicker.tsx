import React from "react";
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

const DatePicker: React.FC<DatePickerProps> = React.memo(() => {
  return (
    <div className="relative">
      <div className="flex border border-gray-300 bg-white rounded-sm focus-within:ring-1 ring-red-300">
        <Button className="text-red-600 py-3 hover:bg-gray-100">
          <FaChevronLeft />
        </Button>
        <input
          type="text"
          readOnly
          value="22.10.2025"
          className="outline-none cursor-pointer text-center w-full"
        />
        <Button className="text-red-600 py-3 hover:bg-gray-100">
          <FaChevronRight />
        </Button>
      </div>
    </div>
  );
});

export default DatePicker;
