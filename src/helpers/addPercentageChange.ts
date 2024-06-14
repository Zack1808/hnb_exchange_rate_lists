export const addPercentageChange = (data: Record<string, any>[]) => {
  if (data.length <= 1) return [...data];

  return data.map((item, index) => {
    if (index === data.length - 1) {
      item.postotak = "Nije dostupno";
      return item;
    }

    const prevRate = Number(data[index + 1].srednji_tecaj.replace(",", "."));
    const currRate = Number(item.srednji_tecaj.replace(",", "."));
    const percentage = ((currRate - prevRate) / prevRate) * 100;
    item.postotak = percentage.toPrecision(2) + "%";

    return item;
  });
};
