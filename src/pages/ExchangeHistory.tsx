import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import Container from "../components/layout/Container";

import List from "../components/common/List";
import Select from "../components/common/Select";
import DatePicker from "../components/common/DatePicker";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Table from "../components/common/Table";
import Chart from "../components/common/Chart";
import Tabs from "../components/common/Tabs";

import { type ChartData, type Currency } from "../types/chart";

import { compareDate, convertToDateString } from "../utils/dateUtils";
import {
  sortData,
  getSpecificItemList,
  getUniqueList,
  addPercentageChange,
  addPercentageFixed,
} from "../utils/dataUtils";

import { useGetListings } from "../hooks/useGetListing";
import { useChartData } from "../hooks/useChartData";

import { BASE_DATA as baseData } from "../utils/baseData";

const NOTES = [
  `Svi tečajevi su iskazani za 1 EUR od uvođenja EUR <strong>(01.01.2023)</strong>.`,
  `Srednji tečajevi za euro u odnosu na druge valute koji su objavljeni u tečajnoj listi HNB-a imaju za cilj pružiti informaciju o tečaju eura u odnosu na druge valute u specifičnom vremenskom razdoblju na datum objave tečajne liste i kao takvi se mogu koristiti isključivo u svrhe predviđene odredbom članka 17. stavka 2. Zakona o uvođenju eura kao službene valute u Republici Hrvatskoj <strong>("Narodne novine" broj 57/2022 i 88/2022).</strong>`,
  "Srednji tečajevi HNB-a nisu namijenjeni za korištenje u pravnim poslovima koji su nastali nakon uvođenja eura kao službene valute u Republici Hrvatskoj, niti bi se oni trebali koristiti, direktno ili indirektno (kao referentna vrijednost) za sklapanje bilo kojih novih pravnih poslova, već je njihovo korištenje ograničeno na pravne poslove u kojima je pozivanje na srednji tečaj HNB-a određeno prije datuma uvođenja eura, osim ako nekim propisom nije drugačije uređeno.",
  "HNB ne može biti odgovoran za korištenje podataka o srednjim tečajevima HNB-a u svrhe za koje to nije namijenjeno.",
  `Za prikaz povijesti tečaja potrebno je odabrati dva datuma koja moraju biti udaljena najmanje <strong>2 dana</strong>.`,
] as const;

const CURRENCIES = [
  {
    value: "AUD",
    label: "Australski dolar",
  },
  {
    value: "CAD",
    label: "Kanadski dolar",
  },
  {
    value: "CZK",
    label: "Češka kruna",
  },
  {
    value: "DKK",
    label: "Danska kruna",
  },
  {
    value: "HUF",
    label: "Mađarska forinta",
  },
  {
    value: "JPY",
    label: "Japanski yen",
  },
  {
    value: "NOK",
    label: "Norveška kruna",
  },
  {
    value: "SEK",
    label: "Švedska kruna",
  },
  {
    value: "CHF",
    label: "Švicarski franak",
  },
  {
    value: "GBP",
    label: "Britanska funta",
  },
  {
    value: "USD",
    label: "Američki dolar",
  },
  {
    value: "BAM",
    label: "Bosanska marka",
  },
  {
    value: "PLN",
    label: "Poljski zlot",
  },
] as const;

const HEADERS = [
  {
    title: "Država",
    value: "drzava",
    isNumber: false,
  },
  {
    title: "Valuta",
    value: "valuta",
    isNumber: false,
  },
  {
    title: "Broj tečajnice",
    value: "broj_tecajnice",
    isNumber: true,
  },
  {
    title: "Datum primjene",
    value: "datum_primjene",
    isNumber: false,
  },
  {
    title: "Kupovni tečaj",
    value: "kupovni_tecaj",
    isNumber: true,
  },
  {
    title: "Srednji tečaj",
    value: "srednji_tecaj",
    isNumber: true,
  },
  {
    title: "Prodajni tečaj",
    value: "prodajni_tecaj",
    isNumber: true,
  },
  {
    title: "Rast/pad tečaja kroz vrijeme",
    value: "postotak_od_prosle_liste",
    isNumber: true,
  },
  {
    title: "Rast/pad tečaja od uvođenja EUR",
    value: "postotak_od_pocetka",
    isNumber: true,
  },
] as const;

const SORTABLE_KEYS = ["drzava", "valuta", "broj_tecajnice"] as const;

type ViewMode = "table" | "chart";

const DEFAULT_FROM_DATE = () => {
  const date = new Date();
  date.setDate(date.getDate() - 2);

  return date;
};

const getDateWithOffset = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const areSameDate = (first: Date, second: Date) =>
  compareDate("day", first, second, "same") &&
  compareDate("month", first, second, "same") &&
  compareDate("year", first, second, "same");

const areCurrenciesEqual = (first: string[], second: string[]) =>
  first.length === second.length &&
  first.every((currency, index) => currency === second[index]);

const createHistoryUrl = (
  currencies: string[],
  fromDate: Date,
  toDate: Date,
  view: ViewMode,
) => {
  const params = new URLSearchParams({
    valuta: encodeURIComponent(JSON.stringify(currencies)),
    datum_primjene_od: convertToDateString(fromDate, "YYYY-MM-DD"),
    datum_primjene_do: convertToDateString(toDate, "YYYY-MM-DD"),
    prikaz: view,
  });

  return `/povijest?${params.toString()}`;
};

const parseCurrencies = (value: string | null) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(decodeURIComponent(value));

    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

const getViewMode = (value: string | null) =>
  value === "chart" ? "chart" : "table";

const ExchangeHistory: React.FC = React.memo(() => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency[]>([]);
  const [fromDate, setFromDate] = useState<Date>(DEFAULT_FROM_DATE());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [display, setDisplay] = useState<ViewMode>("table");

  const location = useLocation();
  const navigate = useNavigate();
  const { convertToChartData } = useChartData();

  const { getCurrencyHistory, loading, error } = useGetListings();

  const fetchData = useCallback(
    async (dateFrom: string, dateTo: string, currencies: string[]) => {
      if (!currencies.length) {
        setData([]);
        setChartData([]);
        return;
      }

      const response = await getCurrencyHistory(dateFrom, dateTo);

      if (!response?.length) {
        setData([]);
        setChartData([]);
        return;
      }

      const filteredData = getSpecificItemList(response, "valuta", currencies);

      if (!filteredData.length) {
        setData([]);
        setChartData([]);
        return;
      }

      const newChartData = convertToChartData(filteredData, currencies, true);

      let newTableData = getUniqueList(filteredData, [
        "broj_tecajnice",
        "valuta",
      ]);

      newTableData = addPercentageChange(newTableData);
      newTableData = addPercentageFixed(newTableData, baseData);

      newTableData = sortData(newTableData, "broj_tecajnice", "asc", true);
      newTableData = sortData(newTableData, "datum_primjene", "asc", false);

      setChartData(newChartData as ChartData[]);
      setData(newTableData);
    },
    [getCurrencyHistory, convertToChartData],
  );

  const toMax = getDateWithOffset(new Date(), -2);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      const search = new URLSearchParams(location.search);

      const urlDateFrom = search.get("datum_primjene_od");
      const urlDateTo = search.get("datum_primjene_do");
      const urlCurrency = parseCurrencies(search.get("valuta"));

      const sameFromDate =
        urlDateFrom !== null && areSameDate(new Date(urlDateFrom), fromDate);

      const sameToDate =
        urlDateTo !== null && areSameDate(new Date(urlDateTo), toDate);

      const sameCurrencies = areCurrenciesEqual(urlCurrency, selectedCurrency);

      if (sameFromDate && sameToDate && sameCurrencies) return;

      navigate(createHistoryUrl(selectedCurrency, fromDate, toDate, "table"));

      void fetchData(
        convertToDateString(new Date(fromDate), "YYYY-MM-DD"),
        convertToDateString(new Date(toDate), "YYYY-MM-DD"),
        selectedCurrency,
      );

      setDisplay("table");
    },
    [location.search, fromDate, toDate, selectedCurrency, navigate, fetchData],
  );

  const handleCurrencyChange = useCallback((value: string) => {
    setSelectedCurrency((prevState) =>
      prevState.includes(value as Currency)
        ? prevState.filter((curr) => curr !== (value as Currency))
        : [...prevState, value as Currency],
    );
  }, []);

  const handleExport = useCallback(() => {
    if (!data.length) return;

    const exportHeaders = HEADERS.map((header) => header.title);

    const rows = data.map((item) => [
      item.drzava,
      item.valuta,
      item.broj_tecajnice,
      item.datum_primjene,
      item.kupovni_tecaj,
      item.srednji_tecaj,
      item.prodajni_tecaj,
      `${item.postotak_od_prosle_liste}%`,
      `${item.postotak_od_pocetka}%`,
    ]);
    const excelData = [exportHeaders, ...rows];

    const columnWidths = exportHeaders.map((_, columnIndex) => {
      const maxLength = Math.max(
        ...excelData.map((row) => {
          const value = row[columnIndex];
          return value == null ? 0 : String(value).length;
        }),
      );

      return { wch: maxLength + 2 };
    });

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    worksheet["!autofilter"] = {
      ref: `A1:I${data.length + 1}`,
    };

    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Izvještaj");

    XLSX.writeFile(workbook, "Izvještaj_promjene_vrijednosti_valuta.xlsx");
  }, [data]);

  const handleDisplayChange = useCallback(
    (view: string) => {
      const nextView = getViewMode(view);

      setDisplay(nextView);

      navigate(createHistoryUrl(selectedCurrency, fromDate, toDate, nextView), {
        replace: true,
      });
    },
    [navigate, selectedCurrency, fromDate, toDate],
  );

  const tableUrl = createHistoryUrl(
    selectedCurrency,
    fromDate,
    toDate,
    "table",
  );

  const chartUrl = createHistoryUrl(
    selectedCurrency,
    fromDate,
    toDate,
    "chart",
  );

  useEffect(() => {
    const minimumToDate = getDateWithOffset(fromDate, 2);

    if (toDate < minimumToDate) {
      setToDate(minimumToDate);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    const minimumFromDate = getDateWithOffset(toDate, -2);
    if (fromDate > minimumFromDate) {
      setFromDate(minimumFromDate);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    const search = new URLSearchParams(location.search);

    const dateFrom = search.get("datum_primjene_od");
    const dateTo = search.get("datum_primjene_do");
    const currencies = parseCurrencies(search.get("valuta"));
    const view = getViewMode(search.get("prikaz"));

    if (!dateFrom || !dateTo || !currencies.length) return;

    const parsedFromDate = new Date(dateFrom);
    const parsedToDate = new Date(dateTo);

    setFromDate(parsedFromDate);
    setToDate(parsedToDate);
    setSelectedCurrency(currencies as Currency[]);
    setDisplay(view);

    void fetchData(dateFrom, dateTo, currencies);
  }, [fetchData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Container spacing="medium">
        <h2 className="text-3xl text-gray-800">Provjera povijesti tečaja</h2>

        <p className="text-lg text-gray-800 max-w-5xl">
          Istražite kako su se tečajevi mijenjali kroz vrijeme. Naša arhiva
          sadrži sve povijesne podatke HNB-a, što vam omogućuje da prepoznate
          trendove i donesete bolje odluke za buduće transakcije.
        </p>
      </Container>
      <Container hasBackground spacing="medium">
        <strong className="text-xl text-red-600 max-w-5xl">Napomena</strong>

        <List content={[...NOTES]} listType="decimal" />

        <form
          className="w-full md:max-w-6/12 flex flex-col gap-4 mt-10"
          onSubmit={handleSubmit}
        >
          <fieldset className="flex flex-col gap-2">
            <label
              htmlFor="currencySelect"
              className="text-lg text-red-600 font-bold"
            >
              Odabir valute
            </label>

            <Select
              options={[...CURRENCIES]}
              value={selectedCurrency}
              placeholder="Odaberi valutu..."
              onChange={handleCurrencyChange}
              id="currencySelect"
              multiple
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2 items-start">
            <label
              htmlFor="fromDate"
              className="text-lg text-red-600 font-bold"
            >
              Datum primjene od
            </label>
            <DatePicker
              value={fromDate}
              onChange={setFromDate}
              min={new Date(2023, 0, 1)}
              max={toMax}
              id="fromDate"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2 items-start">
            <label htmlFor="toDate" className="text-lg text-red-600 font-bold">
              Datum primjene do
            </label>
            <DatePicker
              value={toDate}
              onChange={setToDate}
              min={new Date(2023, 0, 3)}
              max={new Date()}
              id="toDate"
            />
          </fieldset>

          <Button className="self-end" variant="primary">
            Prikaži
          </Button>
        </form>
      </Container>
      <Container spacing="medium">
        <h2 className="text-3xl text-gray-800 mb-6">Prikaz povjesti tečaja</h2>

        <p className="text-lg text-gray-800 max-w-5xl">Prikaži podatke u:</p>

        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-600 text-lg">{error}</p>
        ) : (
          <Tabs
            value={display}
            onChange={handleDisplayChange}
            actionButton={
              <Button
                variant="primary"
                type="button"
                onClick={handleExport}
                className="md:max-w-fit max-w-none justify-center w-full"
                disabled={!data.length}
              >
                Preuzmi Excel datoteku
              </Button>
            }
            tabs={[
              {
                value: "table",
                label: "U tabličnom obliku",
                link: tableUrl,
                content: (
                  <Table
                    headers={[...HEADERS]}
                    data={data}
                    sortable
                    sortableKeys={[...SORTABLE_KEYS]}
                  />
                ),
              },
              {
                value: "chart",
                label: "U grafičkom obliku",
                link: chartUrl,
                content: (
                  <div className="md:h-120 h-200 w-full">
                    <Chart
                      chartData={chartData}
                      currency={selectedCurrency}
                      multiple
                    />
                  </div>
                ),
              },
            ]}
          />
        )}
      </Container>
    </>
  );
});

export default ExchangeHistory;
