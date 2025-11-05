import React, { useMemo } from "react";
import { Link, type LinkProps } from "react-router-dom";

interface BaseButtonProps {
  variant?: "primary" | "secondary" | "none";
}

interface RegularButtonProps
  extends BaseButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

interface LinkButtonProps extends BaseButtonProps, LinkProps {}

interface AnchorButtonProps
  extends BaseButtonProps,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {}

type ButtonProps = RegularButtonProps | LinkButtonProps | AnchorButtonProps;

const buttonClasses = (variant: string, className: string): string => {
  const baseClasses =
    "py-2 px-6 flex rounded-sm items-center gap-2 transition max-w-fit text-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-400 disabled:pointer-events-none";

  const variantClasses =
    {
      primary:
        "text-white bg-red-600 hover:bg-red-500 border-red-600 hover:border-red-500 border",
      secondary:
        "text-red-600 border-red-600 hover:text-red-500 hover:border-red-500 border",
      none: "",
    }[variant] || "";

  return `${baseClasses} ${variantClasses} ${className}`.trim();
};

const Button: React.FC<ButtonProps> = ({
  variant = "none",
  children,
  className = "",
  ...rest
}) => {
  const classNames = useMemo(
    () => buttonClasses(variant, className),
    [variant, className]
  );

  if ("to" in rest)
    return (
      <Link className={classNames} {...(rest as LinkButtonProps)}>
        {children}
      </Link>
    );
  else if ("href" in rest)
    return (
      <a className={classNames} {...(rest as AnchorButtonProps)}>
        {children}
      </a>
    );

  return (
    <button className={classNames} {...(rest as RegularButtonProps)}>
      {children}
    </button>
  );
};

export default Button;
