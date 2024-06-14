import React from "react";

import { HeroContainerProps } from "../interfaces/components";

const HeroContainer: React.FC<HeroContainerProps> = React.memo(
  ({ children, className, ...rest }) => {
    return (
      <section
        className={`w-full h-dvh flex justify-center items-center p-5 ${className}`}
        {...rest}
      >
        <div className="w-full max-w-screen-2xl flex flex-col items-start gap-5 ">
          {children}
        </div>
      </section>
    );
  }
);

export default HeroContainer;
