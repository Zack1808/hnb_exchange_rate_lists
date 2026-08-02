export const getSpecificItemList = <T extends Record<string, string>>(
  data: T[],
  filterBy: keyof T,
  filterItem: string[],
) => {
  return data.filter((item) => filterItem.includes(item[filterBy]));
};

export const getUniqueList = <T extends Record<string, string>>(
  data: T[],
  groupBy: (keyof T)[],
) => {
  const map = new Map<string, T>();

  for (const item of data) {
    const key = groupBy.map((k) => item[k]).join("|");

    if (
      !map.has(key) ||
      new Date(item.datum_primjene) < new Date(map.get(key)!.datum_primjene)
    ) {
      map.set(key, item);
    }
  }

  return [...map.values()];
};
