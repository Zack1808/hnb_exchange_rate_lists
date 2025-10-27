import { useCallback } from "react";

interface UseChartDataReturnProps {
  getCurrency: (data: Record<string, string>[]) => string;
  convertToChartData: (
    data: Record<string, string>[],
    baseData: Record<string, string>[],
    curr: string
  ) => Record<string, string>[];
}

export const useChartData = (): UseChartDataReturnProps => {
  const getRandomNumber = useCallback((min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1) + min);
  }, []);

  const getCurrency = useCallback(
    (data: Record<string, string>[]): string => {
      const newData = data
        .map((item: Record<string, string>) => item.valuta)
        .filter(
          (value: string, index: number, self: string[]) =>
            self.indexOf(value) === index
        );

      const randomNumber = getRandomNumber(0, newData.length - 1);

      return newData[randomNumber];
    },
    [getRandomNumber]
  );

  const addPercentageCalculation = useCallback(
    (
      data: Record<string, string>[],
      percentageOfKey: string,
      addedKey: string,
      percentageOfValue?: number
    ): Record<string, string>[] => {
      return data.map(
        (
          item: Record<string, string>,
          index: number,
          self: Record<string, string>[]
        ) => {
          if (index <= 0 && !percentageOfValue) {
            item[addedKey] = "0.0";
            return item;
          }

          const prevRate =
            percentageOfValue ||
            Number(self[index - 1][percentageOfKey].replace(",", "."));
          const currRate = Number(item[percentageOfKey].replace(",", "."));
          item[addedKey] = `${(
            ((currRate - prevRate) / prevRate) *
            100
          ).toPrecision(2)}`;

          return item;
        }
      );
    },
    []
  );

  const convertToChartData = useCallback(
    (
      data: Record<string, string>[],
      baseData: Record<string, string>[],
      curr: string
    ): Record<string, string>[] => {
      let newData = data.filter(
        (value: Record<string, string>) => value.valuta === curr
      );

      const newBaseData = baseData.filter(
        (value: Record<string, string>) => value.valuta === curr
      );

      console.log(newBaseData);

      if (!newBaseData.length) return newData;

      newData = addPercentageCalculation(
        newData,
        "srednji_tecaj",
        "percentage"
      );

      return addPercentageCalculation(
        newData,
        "srednji_tecaj",
        "percentage_history",
        Number(newBaseData[0].srednji_tecaj.replace(",", "."))
      );
    },
    [addPercentageCalculation]
  );

  return { getCurrency, convertToChartData };
};
