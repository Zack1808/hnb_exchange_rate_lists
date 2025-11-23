import React from "react";

type Options<T = string> = { value: T; label: string; disabled?: boolean };

interface SelectProps<T = string> {
  options: Options<T>[];
  value: T | null;
  onChange?: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Select = <T,>({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: SelectProps) => {
  return (
    <div>
      <button type="button">
        {options.find((o) => o.value === value)?.label ??
          placeholder ??
          "Select..."}
      </button>
      {/* TODO: Build dropdown */}
    </div>
  );
};

export default Select;
