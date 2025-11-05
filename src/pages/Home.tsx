import React, { useCallback, useEffect, useState, useRef } from "react";

import Hero from "../components/layout/Hero";
import Container from "../components/layout/Container";

import Button from "../components/common/Button";
import Chart from "../components/common/Chart";
import Loader from "../components/common/Loader";

import { useGetListings } from "../hooks/useGetListing";
import { useChartData } from "../hooks/useChartData";

import { useBaseExchangeRate } from "../context/BaseExchangeRateContext";

import { convertToDateString } from "../utils/dateUtils";

import { MOCK_CONFIG } from "../services/mock/mockData";

const Home: React.FC = React.memo(() => {
  const [chartData, setChartData] = useState<Record<string, string>[]>([]);
  const [currency, setCurrency] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleHeroButtonClick = useCallback(() => {
    if (!containerRef.current) return;

    containerRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

          <Button
            variant="primary"
            className="mt-6"
            onClick={handleHeroButtonClick}
          >
            Saznajte više
          </Button>
        </div>
        <div className="hidden relative xl:flex xl:flex-col w-[50%] h-[400px]">
          {loading ? (
            <Loader />
          ) : (
            <>
              <Chart chartData={chartData} currency={currency} />
              {MOCK_CONFIG.enableMockData && (
                <small>
                  Ovaj graf koristi testne podatke te će biti ažurirana za
                  prikaz stvarnih podataka
                </small>
              )}
            </>
          )}
        </div>
      </Hero>
      <Container
        spacing="big"
        hasBackground
        className="scroll-mt-96"
        ref={containerRef}
      >
        <h2 className="text-3xl text-gray-800 font-semibold">
          Provjera trenutnog tečaja
        </h2>

        <p className="text-lg text-gray-800 max-w-5xl">
          Pratite najnovije tečajeve iz prve ruke. Naša tečajna lista ažurira se
          redovito, pa uvijek znate po kojem tečaju mijenjate valutu. Donosite
          financijske odluke s pouzdanjem.
        </p>

        <Button
          to={`/tecaj?datum_primjene=${convertToDateString(
            new Date(),
            "YYYY-MM-DD"
          )}`}
          variant="primary"
          className="mt-5"
        >
          Provjerite današnji tečaj
        </Button>
      </Container>
      <Container spacing="big" className="scroll-mt-96">
        <h2 className="text-3xl text-gray-800 font-semibold">
          Pogledajte kretanje tečaja kroz vrijeme
        </h2>

        <p className="text-lg text-gray-800 max-w-5xl">
          Istražite kako su se tečajevi mijenjali kroz vrijeme. Pratite
          trendove, uspoređujte razdoblja i donosite informirane odluke za
          buduće transakcije.
        </p>

        <Button
          to={`/povijest?valuta=ALL&datum_primjene_od=${convertToDateString(
            new Date(new Date().setDate(new Date().getDate() - 2)),
            "YYYY-MM-DD"
          )}&datum_primjene_do=${convertToDateString(
            new Date(),
            "YYYY-MM-DD"
          )}`}
          variant="primary"
          className="mt-5"
        >
          Pogledajte povijest tečajeva
        </Button>
      </Container>
    </>
  );
});

export default Home;
