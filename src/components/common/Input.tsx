import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({
  className = "",
  disabled = false,
  readOnly = false,
  ...rest
}) => {
  const isInteractive = !disabled && !readOnly;

  return (
    <input
      className={`flex gap-4 items-center justify-between w-full p-2 border outline-none border-gray-300 bg-white rounded-sm ${isInteractive ? "focus-within:ring-1 ring-red-300" : "cursor-default"} ${className}`}
      disabled={disabled}
      readOnly={readOnly}
      {...rest}
    />
  );
};

export default Input;
