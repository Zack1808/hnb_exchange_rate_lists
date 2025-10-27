import React, { useMemo } from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  hasBackground?: boolean;
  spacing?: "big" | "small" | "medium" | "none";
}

const Container = React.memo(
  React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ children, hasBackground, spacing = "none" }, ref) => {
      const sectionClassNames = useMemo(() => {
        const spacingClass =
          {
            big: "py-28 md:py-40",
            medium: "py-16 md:py-28",
            small: "py-5",
            none: "",
          }[spacing] || "";

        const backgroundClass = hasBackground ? "bg-gray-100" : "";

        return `w-full px-5 flex justify-center ${spacingClass} ${backgroundClass}`.trim();
      }, [spacing, hasBackground]);

      return (
        <section ref={ref} className={sectionClassNames}>
          <article className="w-full md:max-w-screen-2xl flex flex-col gap-5 items-start">
            {children}
          </article>
        </section>
      );
    }
  )
);

export default Container;
