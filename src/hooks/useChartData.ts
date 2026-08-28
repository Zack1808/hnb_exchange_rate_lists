import { useCallback } from "react";

import {
  addPercentageChange,
  addPercentageFixed,
  sortData,
} from "../utils/dataUtils";

import { BASE_DATA as baseData } from "../utils/baseData";

type DataRow = Record<string, string>;
type ChartDataRow = Record<string, string | number>;

interface UseChartDataReturnProps {
  getCurrency: (data: DataRow[]) => string;
  convertToChartData: (
    data: DataRow[],
    curr: string | string[],
    multi?: boolean,
  ) => ChartDataRow[];
}

export const useChartData = (): UseChartDataReturnProps => {
  const getCurrency = useCallback((data: DataRow[]) => {
    const currencies = [...new Set(data.map((item) => item.valuta))];

    if (!currencies.length) return "";

    const randomIndex = Math.floor(Math.random() * currencies.length);

    return currencies[randomIndex];
  }, []);

  const addPercentageCalculation = useCallback(
    (
      data: DataRow[],
      type: "fixed" | "not fixed" = "not fixed",
    ): Record<string, string>[] => {
      return type === "fixed"
        ? addPercentageFixed(data, baseData, "number")
        : addPercentageChange(data, "number");
    },
    [],
  );

  const convertToMultiChartData = useCallback((data: DataRow[]) => {
    const groupedData = new Map<string, ChartDataRow>();

    for (const item of data) {
      const date = item.datum_primjene;

      const existing = groupedData.get(date);

      const dataChunk: ChartDataRow = {
        datum_primjene: item.datum_primjene,
        [`${item.valuta}_srednji_tecaj`]: item.srednji_tecaj,
        [`${item.valuta}_postotak_od_pocetka`]: item.postotak_od_pocetka,
        [`${item.valuta}_postotak_od_prosle_liste`]:
          item.postotak_od_prosle_liste,
      };

      if (existing) {
        Object.assign(existing, dataChunk);
      } else {
        groupedData.set(date, dataChunk);
      }
    }

    return Array.from(groupedData.values());
  }, []);

  const convertToChartData = useCallback(
    (data: DataRow[], curr: string | string[], multi?: boolean) => {
      const currs = Array.isArray(curr) ? curr : [curr];

      let chartData = data.filter((value: Record<string, string>) =>
        currs.includes(value.valuta),
      );

      chartData = addPercentageCalculation(chartData);

      chartData = addPercentageCalculation(chartData, "fixed");

      chartData = sortData(chartData, "datum_primjene", "desc", false);

      return multi ? convertToMultiChartData(chartData) : chartData;
    },
    [addPercentageCalculation, convertToMultiChartData],
  );

  return { getCurrency, convertToChartData };
};
