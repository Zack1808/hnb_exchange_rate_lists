import React, { useCallback, useEffect, useState } from "react";

import Hero from "../components/common/Hero";
import Button from "../components/common/Button";
import Chart from "../components/common/Chart";

import { useGetListings } from "../hooks/useGetListing";

import { useBaseExchangeRate } from "../context/BaseExchangeRateContext";

const Home: React.FC = React.memo(() => {
  const [chartData, setChartData] = useState<Record<string, string>[]>([]);
  const [currency, setCurrency] = useState<string>("");

  const { getCurrencyHistory, loading } = useGetListings();

  const baseData = useBaseExchangeRate();

  const getRandomNumber = useCallback((min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1) + min);
  }, []);

  const getCurrency = useCallback((data: Record<string, string>[]): string => {
    const newData = data
      .map((item: Record<string, string>) => item.valuta)
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index
      );

    const randomNumber = getRandomNumber(0, newData.length - 1);

    return newData[randomNumber];
  }, []);

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
    []
  );

  const fetchData = useCallback(async () => {
    const historyList = await getCurrencyHistory("2025-01-01", "2025-01-01");

    if (!historyList?.length) return;

    const curr = getCurrency(historyList);

    setCurrency(curr);

    const data = convertToChartData(historyList, baseData, curr);

    setChartData(data);
  }, [baseData]);

  useEffect(() => {
    const fetch = () => {
      const isLargeScreen = () =>
        window.matchMedia("(min-width: 1280px)").matches;

      if (isLargeScreen()) {
        fetchData();
      }
    };

    fetch();

    window.addEventListener("resize", fetch);

    return () => {
      window.removeEventListener("resize", fetch);
    };
  }, [fetchData]);

  return (
    <>
      <Hero className="relative overflow-hidden before:absolute before:inset-[-500px] before:bg-[url(/bg.png)] before:bg-[length:600px_500px] before:bg-[position:10px_20px] before:z-[-10] before:-rotate-45 bg-gradient-to-br from-transparent to-white to-65%">
        <div className="grid gap-4 xl:flex-4/12">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-800">
            Provjera tečaja u stvarnom vremenu
          </h1>
          <p className="text-xl text-gray-800">
            Svi službeni tečajevi Hrvatske narodne banke na jednom mjestu
          </p>

          <Button variant="primary" className="mt-6">
            Saznajte više
          </Button>
        </div>
        <div className="hidden relative xl:flex flex-1 h-[400px]">
          <Chart chartData={chartData} currency={currency} />
        </div>
      </Hero>
    </>
  );
});

export default Home;
