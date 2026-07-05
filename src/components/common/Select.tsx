import React, { useState, useRef } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";

type Options<T = string> = { value: T; label: string; disabled?: boolean };

interface SelectProps<T = string> {
  options: Options<T>[];
  value: T | null;
  onChange?: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps<string>> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const [selectOpen, setSelectOpen] = useState<boolean>(false);

  const selectRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="w-full md:w-xl relative">
      <button
        type="button"
        ref={selectRef}
        onClick={() => {
          setSelectOpen((prevState) => !prevState);
        }}
        className="flex gap-4 items-center justify-between w-full p-2 border outline-none border-gray-300 bg-white rounded-sm focus:ring-1 ring-red-300 "
      >
        {options.find((o) => o.value === value)?.label ??
          placeholder ??
          "Select..."}
        {!selectOpen ? <FaChevronDown /> : <FaChevronUp />}
      </button>
      {/* TODO: Build dropdown */}
      <div
        className={`${selectOpen ? "flex flex-col" : "hidden"} absolute w-full top-full mt-1 bg-white shadow-md max-h-64 overflow-auto`}
      >
        {options.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`w-full px-2 py-3 hover:bg-red-400 hover:text-white ${item.value === value ? "bg-red-600 text-white" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Select;
