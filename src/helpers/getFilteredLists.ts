export const getSpecificItemList = (
  data: Record<string, any>[],
  filterBy: keyof Record<string, any>,
  filterItem: string
) => {
  return data.filter((item) => item[filterBy] === filterItem);
};

export const getUniqueList = (
  data: Record<string, any>[],
  filterBy: keyof Record<string, any>
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
