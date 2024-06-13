import { SortProps } from "../interfaces/helpers";

export const sort = ({ data, key, direction, isNumber }: SortProps) => {
  return data.sort((a, b) => {
    if (isNumber) {
      if (Number(a[key].replace(",", ".")) > Number(b[key].replace(",", ".")))
        return direction === "asc" ? -1 : 1;
      if (Number(a[key].replace(",", ".")) < Number(b[key].replace(",", ".")))
        return direction === "asc" ? 1 : -1;
      return 0;
    } else {
      if (a[key] > b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] < b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    }
  });
};
