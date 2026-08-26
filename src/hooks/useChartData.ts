import { useCallback } from "react";

import {
  addPercentageChange,
  addPercentageFixed,
  sortData,
} from "../utils/dataUtils";

import { BASE_DATA as baseData } from "../utils/baseData";

interface UseChartDataReturnProps {
  getCurrency: (data: Record<string, string>[]) => string;
  convertToChartData: (
    data: Record<string, string>[],
    curr: string | string[],
    multi?: boolean,
  ) => Record<string, string | number>[];
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

  const convertToMultiChartData = useCallback(
    (data: Record<string, string>[]) => {
      let newData: Record<string, string>[] = [];

      for (const item of data) {
        const date = item.datum_primjene;

        const dataChunk = {
          datum_primjene: item.datum_primjene,
          [`${item.valuta}_srednji_tecaj`]: item.srednji_tecaj,
          [`${item.valuta}_postotak_od_pocetka`]: item.postotak_od_pocetka,
          [`${item.valuta}_postotak_od_prosle_liste`]:
            item.postotak_od_prosle_liste,
        };

        const existing = newData.find((it) => it.datum_primjene === date);

        if (existing) {
          Object.assign(existing, dataChunk);
        } else {
          newData = [...newData, dataChunk];
        }
      }

      return newData;
    },
    [],
  );

  const convertToChartData = useCallback(
    (
      data: Record<string, string>[],
      curr: string | string[],
      multi?: boolean,
    ): Record<string, string | number>[] => {
      const currs = Array.isArray(curr) ? curr : [curr];

      let newData = data.filter((value: Record<string, string>) =>
        currs.includes(value.valuta),
      );

      newData = addPercentageCalculation(newData);

      newData = addPercentageCalculation(newData, "fixed");

      newData = sortData(newData, "datum_primjene", "desc", false);

      return multi ? convertToMultiChartData(newData) : newData;
    },
    [addPercentageCalculation],
  );

  return { getCurrency, convertToChartData };
};
