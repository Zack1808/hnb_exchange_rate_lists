import React, { useCallback, useEffect, useState } from "react";

import Hero from "../components/layout/Hero";

import Button from "../components/common/Button";
import Chart from "../components/common/Chart";
import Loader from "../components/common/Loader";

import { useGetListings } from "../hooks/useGetListing";
import { useChartData } from "../hooks/useChartData";

import { useBaseExchangeRate } from "../context/BaseExchangeRateContext";

const Home: React.FC = React.memo(() => {
  const [chartData, setChartData] = useState<Record<string, string>[]>([]);
  const [currency, setCurrency] = useState<string>("");

  const { getCurrencyHistory, loading } = useGetListings();
  const { getCurrency, convertToChartData } = useChartData();

  const baseData = useBaseExchangeRate();

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
        <div className="grid gap-4">
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
        <div className="hidden relative xl:flex xl:flex-col w-[50%] h-[400px]">
          {loading ? (
            <Loader />
          ) : (
            <>
              <Chart chartData={chartData} currency={currency} />
              <small>
                Ovaj graf koristi testne podatke te će biti ažurirana za prikaz
                stvarnih podataka
              </small>
            </>
          )}
        </div>
      </Hero>
    </>
  );
});

export default Home;
