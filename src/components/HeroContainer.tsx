import React from "react";

import { HeroContainerProps } from "../interfaces/components";

const HeroContainer: React.FC<HeroContainerProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default HeroContainer;
