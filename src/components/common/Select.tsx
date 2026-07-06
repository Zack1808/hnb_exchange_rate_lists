import React, { useState, useRef, useCallback } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";

import { useOutsideClick } from "../../hooks/useOutsideClick";

type Options<T = string> = { value: T; label: string; disabled?: boolean };

interface SelectProps<T = string> {
  options: Options<T>[];
  value: T | null;
  onChange?: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

const Select: React.FC<SelectProps<string>> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  id,
}) => {
  const [selectOpen, setSelectOpen] = useState<boolean>(false);

  const selectRef = useRef<HTMLDivElement>(null);

  const toggleSelect = useCallback(() => {
    setSelectOpen((prevState) => !prevState);
  }, []);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent): void => {
      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          toggleSelect();
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!options.length) break;
          !selectOpen && setSelectOpen(true);
          if (value) {
            const index = options.findIndex((item) => item.value === value);
            index > 0 && onChange && onChange(options[index - 1].value);
          } else {
            onChange && onChange(options[0].value);
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (!options.length) break;
          !selectOpen && setSelectOpen(true);
          if (value) {
            const index = options.findIndex((item) => item.value === value);
            index < options.length - 1 &&
              onChange &&
              onChange(options[index + 1].value);
          } else {
            onChange && onChange(options[0].value);
          }
          break;
        case "Escape":
          event.preventDefault();
          setSelectOpen(false);
      }
    },
    [value, onChange, selectOpen],
  );

  const selectItem = useCallback(
    (item: string) => {
      onChange && onChange(item);
      setSelectOpen(false);
    },
    [onChange],
  );

  useOutsideClick(selectRef, () => {
    setSelectOpen(false);
  });

  return (
    <div ref={selectRef} className="w-full md:w-xl relative">
      <button
        type="button"
        disabled={disabled}
        onClick={toggleSelect}
        onKeyDown={handleKeyPress}
        id={id ?? ""}
        className="flex gap-4 items-center justify-between w-full p-2 border outline-none border-gray-300 bg-white rounded-sm focus:ring-1 ring-red-300 "
      >
        {options.find((o) => o.value === value)?.label ??
          placeholder ??
          "Select..."}
        {!selectOpen ? <FaChevronDown /> : <FaChevronUp />}
      </button>
      <div
        className={`${selectOpen ? "flex flex-col" : "hidden"} absolute w-full top-full mt-1 bg-white shadow-md max-h-64 overflow-auto`}
      >
        {options.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`w-full text-left p-3 hover:bg-red-400 hover:text-white ${item.value === value ? "bg-red-600 text-white" : ""}`}
            onClick={() => selectItem(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Select;
