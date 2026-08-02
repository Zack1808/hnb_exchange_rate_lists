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

export const addPercentageChange = (data: Record<string, string>[]) => {
  const prevRate: Record<string, number> = {};

  data.sort((a, b) => {
    if (a.valuta !== b.valuta) {
      return a.valuta.localeCompare(b.valuta);
    }

    return Number(b.broj_tecajnice) - Number(a.broj_tecajnice);
  });

  for (const item of data) {
    const prev = prevRate[item.valuta];

    if (prev !== undefined) {
      item.postotak = `${(((Number(item.kupovni_tecaj.replace(",", ".")) - prev) / prev) * 100).toPrecision(2).replace(".", ",")}%`;
    } else {
      item.postotak = "Nije dostupno";
    }

    prevRate[item.valuta] = Number(item.kupovni_tecaj.replace(",", "."));
  }

  data.sort((a, b) => Number(a.broj_tecajnice) - Number(b.broj_tecajnice));

  return data;
};
