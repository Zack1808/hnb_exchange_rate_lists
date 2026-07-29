import React, { useState, useRef, useCallback, useEffect } from "react";
import { FaCaretUp, FaCaretDown, FaX } from "react-icons/fa6";

import { useOutsideClick } from "../../hooks/useOutsideClick";

import Button from "./Button";

type Options<T = string> = { value: T; label: string; disabled?: boolean };

interface SingleSelectProps {
  value: string | null;
}

interface MultiSelectProps {
  value: string[] | null;
  multiple: true;
}

type SelectProps = {
  options: Options<string>[];
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  multiple?: boolean;
} & (SingleSelectProps | MultiSelectProps);

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  multiple,
  id,
}) => {
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const [hasSpaceBellow, setHasSpaceBellow] = useState<boolean>(true);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const selectRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const optionRef = useRef<HTMLDivElement>(null);

  const toggleSelect = useCallback(() => {
    setSelectOpen((prevState) => !prevState);
    setHighlightedIndex(null);
    checkSpace();
  }, []);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent): void => {
      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (!selectOpen) {
            setSelectOpen(true);
            checkSpace();
            setHighlightedIndex(0);
          } else {
            onChange?.(options[highlightedIndex as number].value);
            !multiple && toggleSelect();
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!options.length) break;
          if (!selectOpen) {
            setSelectOpen(true);
            setHighlightedIndex(0);
            break;
          }
          const arrowUp = (highlightedIndex as number) - 1;
          if (arrowUp >= 0) {
            setHighlightedIndex(arrowUp);
            optionsRef.current[arrowUp]?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (!options.length) break;
          if (!selectOpen) {
            setSelectOpen(true);
            setHighlightedIndex(0);
            break;
          }
          const arrowDown = (highlightedIndex as number) + 1;
          if (arrowDown < options.length) {
            setHighlightedIndex(arrowDown);
            optionsRef.current[arrowDown]?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
          break;
        case "Escape":
          event.preventDefault();
          setSelectOpen(false);
          setHighlightedIndex(null);
      }
    },
    [value, onChange, selectOpen, highlightedIndex, highlightedIndex],
  );

  const selectItem = useCallback(
    (item: string) => {
      onChange && onChange(item);
      !multiple && setSelectOpen(false);
    },
    [onChange, multiple],
  );

  const checkSpace = useCallback(() => {
    if (!divRef.current || !optionRef.current) return;

    const select = divRef.current.getBoundingClientRect();
    const options = optionRef.current.offsetHeight;

    const availableSpace = window.innerHeight - select.bottom;

    setHasSpaceBellow(options < availableSpace);
  }, [selectOpen, divRef.current, optionRef.current]);

  useOutsideClick(selectRef, () => {
    (() => {
      setSelectOpen(false);
      setHighlightedIndex(null);
    })();
  });

  useEffect(() => {
    if (!selectOpen) return;

    checkSpace();

    window.addEventListener("scroll", checkSpace, true);

    return () => {
      window.removeEventListener("scroll", checkSpace, true);
    };
  }, [selectOpen]);

  return (
    <div ref={selectRef} className="w-full relative">
      <div
        ref={divRef}
        onClick={() => !disabled && toggleSelect()}
        onKeyDown={(e) => !disabled && handleKeyPress(e)}
        id={id ?? ""}
        tabIndex={disabled ? -1 : 0}
        className={`flex gap-4 items-center justify-between w-full p-2 border outline-none border-gray-300 bg-white rounded-sm ${!disabled ? "focus-within:ring-1 ring-red-300" : ""} `}
      >
        <span className="w-full border-r-1 border-gray-400 flex gap-1 flex-wrap ">
          {multiple && value?.length
            ? (value as string[]).map((item, index) => (
                <Button
                  variant="primary"
                  className="border-none !px-2 !py-0.5 text-sm"
                  type="button"
                  key={index}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onChange?.(item);
                  }}
                >
                  {options.find((o) => o.value === item)?.label}
                  <FaX />
                </Button>
              ))
            : !multiple && value
              ? options.find((o) => o.value === value)?.label
              : placeholder
                ? placeholder
                : "Select..."}
        </span>
        {!selectOpen ? <FaCaretDown /> : <FaCaretUp />}
      </div>
      <div
        className={`${selectOpen ? "flex flex-col" : "hidden"} fixed md:absolute z-50 w-full ${hasSpaceBellow ? "md:top-full md:mt-1 md:bottom-auto" : "md:bottom-full md:mb-1 md:top-auto"} top-0 bottom-0 md:left-auto left-0 md:right-auto right-0 bg-black/40 shadow-md md:max-h-64 flex items-center justify-center`}
        onClick={() => setSelectOpen(false)}
      >
        <div
          className="bg-white md:w-full w-sm rounded-md overflow-auto md:max-h-64 max-h-7/12"
          ref={optionRef}
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            event.target !== optionRef?.current &&
              !multiple &&
              setSelectOpen(false) &&
              setHighlightedIndex(null);
          }}
        >
          {options.map((item, index: number) => (
            <button
              key={item.value}
              ref={(el) => {
                optionsRef.current[index] = el;
              }}
              type="button"
              className={`w-full text-left p-3 hover:bg-red-400 hover:text-white  ${item.value === value ? "bg-red-600 text-white" : multiple && value?.includes(item.value) ? "bg-red-600 text-white" : ""} ${highlightedIndex === index ? "!bg-red-400 text-white" : ""}`}
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
