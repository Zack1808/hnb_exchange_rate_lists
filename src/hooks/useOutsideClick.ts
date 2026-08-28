import React, { useEffect, useRef } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
) => {
  useEffect(() => {
    const callbackRef = useRef(callback);

    useEffect(() => {
      callbackRef.current = callback;
    }, [callback]);

    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      if (!ref.current?.contains(target)) callbackRef.current();
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [ref]);
};
