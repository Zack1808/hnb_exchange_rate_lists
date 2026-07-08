import React, { useState, useRef, useCallback, useEffect } from "react";
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
  const [hasSpaceBellow, setHasSpaceBellow] = useState<boolean>(true);

  const selectRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const optionRef = useRef<HTMLDivElement>(null);

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
            if (index > 0) {
              onChange && onChange(options[index - 1].value);
              optionsRef.current[index - 1]?.scrollIntoView({
                block: "nearest",
                behavior: "instant",
              });
            }
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
            if (index < options.length - 1) {
              onChange && onChange(options[index + 1].value);
              optionsRef.current[index + 1]?.scrollIntoView({
                block: "nearest",
                behavior: "instant",
              });
            }
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

  const checkSpace = useCallback(() => {
    if (!buttonRef.current || !optionRef.current) return;

    const select = buttonRef.current.getBoundingClientRect();
    const options = optionRef.current.offsetHeight;

    const availableSpace = window.innerHeight - select.bottom;

    selectOpen && setHasSpaceBellow(options < availableSpace);
  }, [selectOpen, buttonRef.current, optionRef.current]);

  useOutsideClick(selectRef, () => {
    setSelectOpen(false);
  });

  useEffect(() => {
    window.addEventListener("scroll", checkSpace, true);

    return () => {
      window.removeEventListener("scroll", checkSpace, true);
    };
  }, [selectOpen]);

  return (
    <div ref={selectRef} className="w-full relative">
      <button
        ref={buttonRef}
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
        className={`${selectOpen ? "flex flex-col" : "hidden"} fixed md:absolute z-50 w-full ${hasSpaceBellow ? "md:top-full md:mt-1 md:bottom-auto" : "md:bottom-full md:mb-1 md:top-auto"} top-0 bottom-0 md:left-auto left-0 md:right-auto right-0 bg-black/40 shadow-md md:max-h-64 flex items-center justify-center`}
        onClick={(event: React.MouseEvent) =>
          event.target !== optionRef?.current && setSelectOpen(false)
        }
      >
        <div
          className="bg-white md:w-full w-sm rounded-md overflow-auto md:max-h-64 max-h-7/12"
          ref={optionRef}
        >
          {options.map((item, index: number) => (
            <button
              key={item.value}
              ref={(el) => {
                optionsRef.current[index] = el;
              }}
              type="button"
              className={`w-full text-left p-3 hover:bg-red-400 hover:text-white ${item.value === value ? "bg-red-600 text-white" : ""}`}
              onClick={() => selectItem(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Select;
