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

  return <button {...rest}></button>;
};

export default Button;
