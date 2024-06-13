import React from "react";

import { ContainerProps } from "../interfaces/components";

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, background, spacing }, ref) => {
    const getSpacing = () => {
      switch (spacing) {
        case "big":
          return "py-20 md:py-40";
        case "medium":
          return "py-10 md:py-20";
        case "small":
          return "py-5";
        default:
          return;
      }
    };

    return (
      <div
        ref={ref}
        className={`w-full px-5 ${getSpacing()}  flex justify-center ${
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
