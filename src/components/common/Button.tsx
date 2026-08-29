import { ButtonHTMLAttributes, AnchorHTMLAttributes, type FC } from "react";
import { Link, type LinkProps } from "react-router-dom";

interface BaseButtonProps {
  variant?: "primary" | "secondary" | "none";
}

type RegularButtonProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement>;

type LinkButtonProps = BaseButtonProps & LinkProps;

type AnchorButtonProps = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonProps = RegularButtonProps | LinkButtonProps | AnchorButtonProps;

const BASE_CLASSES =
  "py-2 px-6 flex rounded-sm items-center gap-2 transition max-w-fit text-lg disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-400 disabled:pointer-events-none";

const VARIANT_CLASSES = {
  primary:
    "border border-red-600 bg-red-600 text-white hover:border-red-500 hover:bg-red-500",
  secondary:
    "border border-red-600 text-red-600 hover:border-red-500 hover:text-red-500",
  none: "",
} as const;

const buttonClasses = (
  variant: BaseButtonProps["variant"],
  className: string,
): string => {
  return `${BASE_CLASSES} ${VARIANT_CLASSES[variant || "none"]} ${className}`.trim();
};

const Button: FC<ButtonProps> = ({
  variant = "none",
  children,
  className = "",
  ...rest
}) => {
  const classNames = buttonClasses(variant, className);

  if ("to" in rest)
    return (
      <Link className={classNames} {...rest}>
        {children}
      </Link>
    );
  else if ("href" in rest)
    return (
      <a className={classNames} {...rest}>
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
