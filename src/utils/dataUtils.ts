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

  for (const item of data) {
    const prev = prevRate[item.valuta];

    if (prev !== undefined) {
      item.postotak_od_prosle_liste = `${(((Number(item.kupovni_tecaj.replace(",", ".")) - prev) / prev) * 100).toPrecision(2).replace(".", ",")}%`;
    } else {
      item.postotak_od_prosle_liste = "Nije dostupno";
    }

    prevRate[item.valuta] = Number(item.kupovni_tecaj.replace(",", "."));
  }

  return data;
};

export const addPercentageFixed = (
  data: Record<string, string>[],
  reference: Record<string, string>[],
) => {
  const firstRateMap: Record<string, number> = {};

  for (const item of reference) {
    firstRateMap[item.valuta] = Number(item.kupovni_tecaj.replace(",", "."));
  }

  for (const item of data) {
    const firstRate = firstRateMap[item.valuta];

    if (firstRate !== undefined) {
      item.postotak_od_pocetka = `${(((Number(item.kupovni_tecaj.replace(",", ".")) - firstRate) / firstRate) * 100).toPrecision(2).replace(".", ",")}%`;
    } else item.postotak_od_pocetka = "Nije dostupno";
  }

  return data;
};
