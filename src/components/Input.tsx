import React from "react";

import { InputProps } from "../interfaces";

const Input: React.FC<InputProps> = ({ className, ...rest }) => {
  return (
    <input
      className={`outline-none bg-gray-100 border px-3 py-2 w-full md:max-w-xl rounded-sm focus:ring-1 text-lg ${className}`}
      {...rest}
    />
  );
};

export default Input;
