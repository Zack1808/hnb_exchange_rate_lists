import { useCallback } from "react";

import { addPercentageChange, addPercentageFixed } from "../utils/dataUtils";

import { BASE_DATA as baseData } from "../utils/baseData";

interface UseChartDataReturnProps {
  getCurrency: (data: Record<string, string>[]) => string;
  convertToChartData: (
    data: Record<string, string>[],
    baseData: Record<string, string>[],
    curr: string,
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
            self.indexOf(value) === index,
        );

      const randomNumber = getRandomNumber(0, newData.length - 1);

      return newData[randomNumber];
    },
    [getRandomNumber],
  );

  const addPercentageCalculation = useCallback(
    (
      data: Record<string, string>[],
      percentageOfValue: "fixed" | "not fixed" = "not fixed",
    ): Record<string, string>[] => {
      return percentageOfValue === "not fixed"
        ? addPercentageChange(data, "number")
        : addPercentageFixed(data, baseData, "number");
    },
    [],
  );

  const convertToChartData = useCallback(
    (
      data: Record<string, string>[],
      baseData: Record<string, string>[],
      curr: string,
    ): Record<string, string>[] => {
      let newData = data.filter(
        (value: Record<string, string>) => value.valuta === curr,
      );

      const newBaseData = baseData.filter(
        (value: Record<string, string>) => value.valuta === curr,
      );

      if (!newBaseData.length) return newData;

      newData = addPercentageCalculation(newData);

      return addPercentageCalculation(newData, "fixed");
    },
    [addPercentageCalculation],
  );

  return { getCurrency, convertToChartData };
};
