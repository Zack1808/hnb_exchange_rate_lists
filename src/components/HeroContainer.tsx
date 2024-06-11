import React from "react";

import { HeroContainerProps } from "../interfaces/components";

const HeroContainer: React.FC<HeroContainerProps> = ({ children }) => {
  return (
    <section className="w-full h-dvh flex justify-center items-center">
      <div className="w-full max-w-screen-2xl">{children}</div>
    </section>
  );
};

export default HeroContainer;
