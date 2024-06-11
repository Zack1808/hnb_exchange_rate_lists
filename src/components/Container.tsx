import React from "react";

import { ContainerProps } from "../interfaces/components";

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children }, ref) => {
    return (
      <div>
        <section>{children}</section>
      </div>
    );
  }
);

export default Container;
