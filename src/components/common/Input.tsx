import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ ...rest }) => {
  return (
    <input
      className={`flex gap-4 items-center justify-between w-full p-2 border outline-none border-gray-300 bg-white rounded-sm ${!rest.disabled && !rest.readOnly ? "focus-within:ring-1 ring-red-300" : "cursor-default"} ${rest.className}`}
      {...rest}
    />
  );
};

export default Input;
