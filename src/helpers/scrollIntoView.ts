import { ScrollIntoViewProps } from "../interfaces";

export const scrollIntoView = ({ target }: ScrollIntoViewProps) => {
  target?.current?.scrollIntoView({
    behavior: "smooth",
    inline: "start",
  });
};
