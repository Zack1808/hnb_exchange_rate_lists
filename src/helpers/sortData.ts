import { SortProps } from "../interfaces";

export const sort = ({ data, key, direction, isNumber }: SortProps) => {
  let list = [...data];
  return list.sort((a, b) => {
    if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
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
    }
    return 0;
  });
};
