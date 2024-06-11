import { ScrollIntoViewProps } from "../interfaces/helpers";

export const scrollIntoView = ({ target }: ScrollIntoViewProps) => {
  target?.current?.scrollIntoView({
    behavior: "smooth",
    inline: "start",
  });
};
