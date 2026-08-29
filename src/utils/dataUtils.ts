export const sortData = (
  data: Record<string, string>[],
  key: string,
  direction: "asc" | "desc",
  isNumber: boolean,
): Record<string, string>[] => {
  return [...data].sort((a, b) => {
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

export const addPercentageChange = (
  data: Record<string, string>[],
  dataType: "number" | "string" = "string",
) => {
  const prevRate: Record<string, number> = {};

  for (const item of data) {
    const prev = prevRate[item.valuta];

    if (prev !== undefined) {
      const percentage = (
        ((Number(item.kupovni_tecaj.replace(",", ".")) - prev) / prev) *
        100
      ).toPrecision(2);
      if (dataType === "number") item.postotak_od_prosle_liste = percentage;
      else item.postotak_od_prosle_liste = `${percentage.replace(".", ",")}`;
    } else {
      dataType === "string"
        ? (item.postotak_od_prosle_liste = "0,0")
        : (item.postotak_od_prosle_liste = "0.0");
    }

    prevRate[item.valuta] = Number(item.kupovni_tecaj.replace(",", "."));
  }

  return data;
};

export const addPercentageFixed = (
  data: Record<string, string>[],
  reference: Record<string, string>[],
  dataType: "number" | "string" = "string",
) => {
  const firstRateMap: Record<string, number> = {};

  for (const item of reference) {
    firstRateMap[item.valuta] = Number(item.kupovni_tecaj.replace(",", "."));
  }

  for (const item of data) {
    const firstRate = firstRateMap[item.valuta];

    if (firstRate !== undefined) {
      const percentage = (
        ((Number(item.kupovni_tecaj.replace(",", ".")) - firstRate) /
          firstRate) *
        100
      ).toPrecision(2);
      if (dataType === "number") item.postotak_od_pocetka = percentage;
      else item.postotak_od_pocetka = `${percentage.replace(".", ",")}`;
    } else
      dataType === "string"
        ? (item.postotak_od_pocetka = "0,0")
        : (item.postotak_od_pocetka = "0.0");
  }

  return data;
};
