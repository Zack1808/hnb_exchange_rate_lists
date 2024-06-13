export const addPercentageChange = (data: Record<string, any>[]) => {
  let list = [...data];
  if (list.length <= 1) return list;
  for (let i = 0; i < list.length - 1; i++) {
    const prevRate = Number(list[i + 1].srednji_tecaj.replace(",", "."));
    const currRate = Number(list[i].srednji_tecaj.replace(",", "."));
    console.log();
    const percentage = ((currRate - prevRate) / prevRate) * 100;
    list[i].postotak = percentage.toPrecision(2) + "%";
  }

  list[list.length - 1].postotak = "Nije dostupno";

  return list;
};
