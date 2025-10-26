import React from "react";

const Hero: React.FC<React.HTMLAttributes<HTMLElement>> = React.memo(
  ({ children, className = "", ...rest }) => {
    return (
      <section
        className="w-full h-dvh flex justify-center items-center"
        {...rest}
      >
        <article
          className="w-full max-w-screen-2xl flex items-center justify-between
         gap-5"
        >
          {children}
        </article>
      </section>
    );
  }
);

export default Hero;
