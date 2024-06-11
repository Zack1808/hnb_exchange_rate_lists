import React from "react";

import { ContainerProps } from "../interfaces/components";

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, background }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full px-5 md:py-40 py-20  flex justify-center ${
          background ? "bg-gray-100" : ""
        }`}
      >
        <section className="w-full md:max-w-screen-2xl flex flex-col gap-5 items-start">
          {children}
        </section>
      </div>
    );
  }
);

export default Container;
