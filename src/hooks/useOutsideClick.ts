import React, { useEffect } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
): void => {
  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      if (!ref.current?.contains(event.target as Node)) callback();
    };

    document.addEventListener("click", handleClick);

    return (): void => document.removeEventListener("click", handleClick);
  }, [ref, callback]);
};
