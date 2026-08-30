import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useId,
} from "react";
import { FaCaretUp, FaCaretDown, FaX } from "react-icons/fa6";

import { useOutsideClick } from "../../hooks/useOutsideClick";

type Option = { value: string; label: string };

interface SingleSelectProps {
  value: string | null;
}

interface MultiSelectProps {
  value: string[] | null;
  multiple: true;
}

type BaseSelectProps = {
  options: Option[];
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  multiple?: boolean;
};

type SelectProps = BaseSelectProps & (SingleSelectProps | MultiSelectProps);

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Odaberi...",
  disabled = false,
  multiple = false,
  id,
}) => {
  const generatedId = useId();
  const selectId = id ?? `select-${generatedId}`;
  const listboxId = `${selectId}-listbox`;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasSpaceBelow, setHasSpaceBelow] = useState<boolean>(true);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const selectRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const optionsMap = useMemo(() => {
    return new Map(options.map((option) => [option.value, option]));
  }, [options]);

  const selectedValues = useMemo(
    () => (multiple ? (value ?? []) : value ? [value] : []),
    [multiple, value],
  );

  const selectedOptions = useMemo(() => {
    if (!Array.isArray(selectedValues)) return [];

    return selectedValues
      .map((selectedValue) => {
        if (Array.isArray(selectedValue)) return [];
        return optionsMap.get(selectedValue);
      })
      .filter((option): option is Option => Boolean(option));
  }, [selectedValues, optionsMap]);

  const closeSelect = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(null);
  }, []);

  const openSelect = useCallback(() => {
    if (disabled || !options.length) return;

    setIsOpen(true);
  }, [disabled, options.length]);

  const checkSpace = useCallback(() => {
    if (!triggerRef.current || !optionsContainerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const optionsHeight = optionsContainerRef.current.offsetHeight;

    const availableSpace = window.innerHeight - triggerRect.bottom;

    setHasSpaceBelow(optionsHeight < availableSpace);
  }, []);

  const toggleSelect = useCallback(() => {
    isOpen ? closeSelect() : openSelect();
  }, [isOpen, closeSelect, openSelect]);

  const selectItem = useCallback(
    (item: string) => {
      onChange?.(item);
      if (!multiple) {
        closeSelect();
        triggerRef.current?.focus();
      }
    },
    [onChange, multiple, closeSelect],
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      if (disabled || !options.length) return;

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();

          if (!isOpen) {
            openSelect();
            setHighlightedIndex(0);
            return;
          }
          if (highlightedIndex !== null) {
            selectItem(options[highlightedIndex].value);
          }

          break;
        case "ArrowUp":
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(0);
            break;
          }
          if (highlightedIndex !== null) {
            const highlight =
              event.key === "ArrowDown"
                ? highlightedIndex + 1
                : highlightedIndex - 1;
            if (highlight >= 0 && highlight < options.length) {
              setHighlightedIndex(highlight);
            }
          }

          break;
        case "Home":
          if (isOpen) {
            event.preventDefault();
            setHighlightedIndex(0);
          }
          break;
        case "End":
          if (isOpen) {
            event.preventDefault();
            setHighlightedIndex(options.length - 1);
          }
          break;
        case "Tab":
          closeSelect();
          break;
        case "Escape":
          event.preventDefault();
          closeSelect();
          break;
      }
    },
    [
      disabled,
      isOpen,
      openSelect,
      closeSelect,
      highlightedIndex,
      options,
      selectItem,
    ],
  );

  useOutsideClick(selectRef, closeSelect);

  const displaySelectValue = useMemo(() => {
    return selectedOptions.length > 0 ? (
      selectedOptions.map((option) =>
        multiple ? (
          <span
            key={option.value}
            className="flex items-center gap-1 rounded-sm bg-red-600 px-2 py-0.5 text-sm text-white"
          >
            {option.label}

            <button
              type="button"
              tabIndex={-1}
              aria-label={`Ukloni ${option.label}`}
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                onChange?.(option.value);
              }}
              className="rounded-sm outline-none focus:ring-1 focus:ring-white"
            >
              <FaX aria-hidden="true" />
            </button>
          </span>
        ) : (
          <span key={option.value}>{option.label}</span>
        ),
      )
    ) : (
      <span className="text-gray-500">{placeholder}</span>
    );
  }, [multiple, value, placeholder, onChange, optionsMap]);

  useEffect(() => {
    if (!isOpen) return;

    checkSpace();

    window.addEventListener("scroll", checkSpace, true);
    window.addEventListener("resize", checkSpace);

    return () => {
      window.removeEventListener("scroll", checkSpace, true);
      window.removeEventListener("resize", checkSpace);
    };
  }, [isOpen, checkSpace]);

  useEffect(() => {
    if (highlightedIndex === null) return;

    optionsRef.current[highlightedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [highlightedIndex]);

  return (
    <div ref={selectRef} className="w-full relative">
      <div
        ref={triggerRef}
        id={selectId}
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-disabled={disabled || undefined}
        aria-activedescendant={
          isOpen && highlightedIndex !== null
            ? `${listboxId}-option-${highlightedIndex}`
            : undefined
        }
        onClick={toggleSelect}
        onKeyDown={handleKeyPress}
        className={`flex gap-4 items-center justify-between w-full p-2 border outline-none border-gray-300 bg-white rounded-sm ${!disabled ? "focus-within:ring-1 ring-red-300 cursor-pointer" : "cursor-default bg-gray-100 text-gray-400"} `}
      >
        <span className="w-full flex border-r items-center border-gray-400 gap-1 flex-wrap pr-2">
          {displaySelectValue}
        </span>
        {!isOpen ? (
          <FaCaretDown aria-hidden="true" />
        ) : (
          <FaCaretUp aria-hidden="true" />
        )}
      </div>

      {isOpen && (
        <div
          className={`fixed inset-x-0 top-0 bottom-0 z-50 flex items-center justify-center bg-black/40 
            md:absolute md:inset-x-auto md:px-0 px-3 md:left-0 md:right-0 md:bg-transparent ${hasSpaceBelow ? "md:top-full md:bottom-auto md:mt-1" : "md:top-auto md:bottom-full md:mb-1"}`}
          onClick={closeSelect}
        >
          <div
            ref={optionsContainerRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            className="max-h-7/12 w-sm overflow-y-auto rounded-md bg-white shadow-md md:max-h-64 md:w-full"
            onClick={(event) => event.stopPropagation()}
          >
            {options.map((option, index) => {
              const isSelected = selectedValues.includes(option.value);
              const isHighlighted = highlightedIndex === index;

              return (
                <button
                  key={option.value}
                  id={`${listboxId}-option-${index}`}
                  ref={(element) => {
                    optionsRef.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectItem(option.value)}
                  className={`w-full p-3 text-left outline-none ${isHighlighted ? "bg-red-400 text-white" : isSelected ? "bg-red-600 text-white" : "hover:bg-red-400 hover:text-white"}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
