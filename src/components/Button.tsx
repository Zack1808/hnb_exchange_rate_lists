import React from "react";

import { ButtonProps } from "../interfaces/components";

const Button: React.FC<ButtonProps> = ({
  primary,
  secondary,
  children,
  disabled,
  className,
  ...rest
}) => {
  if (Number(!!primary) + Number(!!secondary) > 1)
    throw new Error(
      "The Button component can only be used as either primary or secondary!"
    );

  const primaryClasses =
    "text-white bg-red-600 hover:bg-red-500 border border-red-600 hover:border-red-500";

  const secondaryClasses =
    "text-red-600 border border-red-600 hover:text-red-500 hover:border-red-500";

  const disabledClasses =
    "bg-gray-300 !text-white border-gray-300 hover:bg-gray-300 hover:border-gray-300";

  console.log(disabled);

  return (
    <button
      className={`py-2 px-4 flex rounded-sm items-center gap-2 transition  hover:bg-gray-100 text-lg ${
        primary ? primaryClasses : ""
      } ${secondary ? secondaryClasses : ""} ${className} ${
        disabled ? disabledClasses : ""
      } `}
      {...rest}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
