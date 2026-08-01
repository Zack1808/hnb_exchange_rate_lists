export const getSpecificItemList = <T extends Record<string, string>>(
  data: T[],
  filterBy: keyof T,
  filterItem: string[],
) => {
  return data.filter((item) => filterItem.includes(item[filterBy]));
};

export const getUniqueList = <T extends Record<string, string>>(
  data: T[],
  filterBy: keyof T,
) => {
  if (!data.length) return [];

  const map = new Map();

  data.forEach((item) => {
    if (item.hasOwnProperty(filterBy)) {
      const key = item[filterBy];
      const date = new Date(item["datum_primjene"]);

      if (!map.has(key) || date < new Date(map.get(key)["datum_primjene"])) {
        map.set(key, item);
      }
    }
  });

  return Array.from(map.values());
};
