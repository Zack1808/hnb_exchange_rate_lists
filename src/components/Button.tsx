import React from "react";

import { ButtonProps } from "../interfaces/components";

const Button: React.FC<ButtonProps> = ({
  primary,
  secondary,
  children,
  disabled,
  ...rest
}) => {
  if (Number(!!primary) + Number(!!secondary) > 1)
    throw new Error(
      "The Button component can only be used as either primary or secondary!"
    );

  const primaryClasses =
    "text-white !bg-red-600 hover:!bg-red-500 border !border-red-600 hover:!border-red-500";

  const secondaryClasses =
    "text-red-600 border border-red-600 hover:text-red-500 hover:border-red-500";

  const disabledClasses =
    "!bg-gray-400 text-white !border-gray-400 hover:!bg-gray-400 hover:!border-gray-400";

  return (
    <button
      className={`py-2 px-4 flex rounded-sm items-center gap-2 transition  hover:bg-gray-100 ${
        primary ? primaryClasses : ""
      } ${secondary ? secondaryClasses : ""} ${
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
