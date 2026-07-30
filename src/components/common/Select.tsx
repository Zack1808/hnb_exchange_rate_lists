import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { FaCaretUp, FaCaretDown, FaX } from "react-icons/fa6";

import { useOutsideClick } from "../../hooks/useOutsideClick";

import Button from "./Button";

type Options = { value: string; label: string };

interface SingleSelectProps {
  value: string | null;
}

interface MultiSelectProps {
  value: string[] | null;
  multiple: true;
}

type SelectProps = {
  options: Options[];
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
  const [hasSpaceBelow, setHasSpaceBelow] = useState<boolean>(true);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const selectRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const optionRef = useRef<HTMLDivElement>(null);

  const optionsMap = useMemo(() => {
    return new Map(options.map((o) => [o.value, o]));
  }, [options]);

  const displaySelectValue = useMemo(() => {
    if (multiple && value?.length) {
      return (value as string[]).map((item) => (
        <Button
          variant="primary"
          className="border-none !px-2 !py-0.5 text-sm"
          type="button"
          key={item}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onChange?.(item);
          }}
        >
          {optionsMap.get(item)?.label}
          <FaX />
        </Button>
      ));
    } else if (!multiple && value) {
      return optionsMap.get(value)?.label;
    } else return placeholder ?? "Select...";
  }, [multiple, value, placeholder, onChange, optionsMap]);

  const checkSpace = useCallback(() => {
    if (!divRef.current || !optionRef.current) return;

    const select = divRef.current.getBoundingClientRect();
    const options = optionRef.current.offsetHeight;

    const availableSpace = window.innerHeight - select.bottom;

    setHasSpaceBelow(options < availableSpace);
  }, []);

  const toggleSelect = useCallback(() => {
    setSelectOpen((prev) => {
      if (prev) {
        setHighlightedIndex(null);
      }

      return !prev;
    });
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
            if (highlightedIndex === null) return;
            onChange?.(options[highlightedIndex].value);
            !multiple && toggleSelect();
          }
          break;
        case "ArrowUp":
        case "ArrowDown":
          event.preventDefault();
          if (!options.length) break;
          if (!selectOpen) {
            setSelectOpen(true);
            setHighlightedIndex(0);
            break;
          }
          if (highlightedIndex === null) return;
          const highlight =
            event.key === "ArrowDown"
              ? highlightedIndex + 1
              : highlightedIndex - 1;
          if (highlight >= 0 && highlight < options.length) {
            setHighlightedIndex(highlight);
            optionsRef.current[highlight]?.scrollIntoView({
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
    [onChange, selectOpen, multiple, options, toggleSelect, highlightedIndex],
  );

  const selectItem = useCallback(
    (item: string) => {
      onChange?.(item);
      !multiple && setSelectOpen(false);
    },
    [onChange, multiple],
  );

  useOutsideClick(selectRef, () => {
    setSelectOpen(false);
    setHighlightedIndex(null);
  });

  useEffect(() => {
    if (!selectOpen) return;

    checkSpace();

    window.addEventListener("scroll", checkSpace, true);

    return () => {
      window.removeEventListener("scroll", checkSpace, true);
    };
  }, [selectOpen, checkSpace]);

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
          {displaySelectValue}
        </span>
        {!selectOpen ? <FaCaretDown /> : <FaCaretUp />}
      </div>
      <div
        className={`${selectOpen ? "flex flex-col" : "hidden"} fixed md:absolute z-50 w-full ${hasSpaceBelow ? "md:top-full md:mt-1 md:bottom-auto" : "md:bottom-full md:mb-1 md:top-auto"} top-0 bottom-0 md:left-auto left-0 md:right-auto right-0 bg-black/40 shadow-md md:max-h-64 flex items-center justify-center`}
        onClick={() => setSelectOpen(false)}
      >
        <div
          className="bg-white md:w-full w-sm rounded-md overflow-auto md:max-h-64 max-h-7/12"
          ref={optionRef}
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            if (event.target !== optionRef.current && !multiple) {
              setSelectOpen(false);
              setHighlightedIndex(null);
            }
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
