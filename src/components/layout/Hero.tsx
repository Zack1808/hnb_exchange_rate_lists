import React, { useMemo } from "react";

const Hero: React.FC<React.HTMLAttributes<HTMLElement>> = React.memo(
  ({ children, className = "", ...rest }) => {
    const sectionClasses = useMemo(
      () => `w-full h-dvh flex justify-center items-center ${className}`.trim(),
      [className]
    );

    return (
      <section className={sectionClasses} {...rest}>
        <article
          className="w-full max-w-screen-2xl flex items-center justify-between
         gap-5 p-5"
        >
          {children}
        </article>
      </section>
    );
  }
);

export default Hero;
