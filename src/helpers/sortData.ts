import { SortProps } from "../interfaces/helpers";

export const sort = ({ data, key, direction }: SortProps) => {
  return data.sort((a, b) => {
    if (a[key] > b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] < b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });
};
