export const getSpecificItemList = <T extends Record<string, string>>(
  data: T[],
  filterBy: keyof T,
  filterItem: string[],
) => {
  return data.filter((item) => filterItem.includes(item[filterBy]));
};
