import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Container from "../components/layout/Container";

import List from "../components/common/List";
import Select from "../components/common/Select";
import DatePicker from "../components/common/DatePicker";
import Button from "../components/common/Button";

import { compareDate, convertToDateString } from "../utils/dateUtils";

import { getSpecificItemList, getUniqueList } from "../utils/dataUtils";

import { useGetListings } from "../hooks/useGetListing";

const NOTES = [
  `Svi tečajevi su iskazani za 1 EUR od uvođenja EUR <strong>(01.01.2023)</strong>.`,
  `Srednji tečajevi za euro u odnosu na druge valute koji su objavljeni u tečajnoj listi HNB-a imaju za cilj pružiti informaciju o tečaju eura u odnosu na druge valute u specifičnom vremenskom razdoblju na datum objave tečajne liste i kao takvi se mogu koristiti isključivo u svrhe predviđene odredbom članka 17. stavka 2. Zakona o uvođenju eura kao službene valute u Republici Hrvatskoj <strong>("Narodne novine" broj 57/2022 i 88/2022).</strong>`,
  "Srednji tečajevi HNB-a nisu namijenjeni za korištenje u pravnim poslovima koji su nastali nakon uvođenja eura kao službene valute u Republici Hrvatskoj, niti bi se oni trebali koristiti, direktno ili indirektno (kao referentna vrijednost) za sklapanje bilo kojih novih pravnih poslova, već je njihovo korištenje ograničeno na pravne poslove u kojima je pozivanje na srednji tečaj HNB-a određeno prije datuma uvođenja eura, osim ako nekim propisom nije drugačije uređeno.",
  "HNB ne može biti odgovoran za korištenje podataka o srednjim tečajevima HNB-a u svrhe za koje to nije namijenjeno.",
  `Za prikaz povijesti tečaja potrebno je odabrati dva datuma koja moraju biti udaljena najmanje <strong>2 dana</strong>.`,
] as string[];

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
];

const ExchangeHistory: React.FC = React.memo(() => {
  const [selectedCurrency, setSelectedCurrency] = useState<string[]>([]);
  const [toDate, setToDate] = useState<Date>(new Date());
  const [fromDate, setFromDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d;
  });
  const [data, setData] = useState<Record<string, string>[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const { getCurrencyHistory } = useGetListings();

  const fetchData = useCallback(
    async (dateFrom: string, dateTo: string): Promise<void> => {
      let newData = await getCurrencyHistory(dateFrom, dateTo);
      if (!newData?.length) return;

      newData = getSpecificItemList(newData, "valuta", selectedCurrency);
      newData = getUniqueList(newData, "broj_tecajnice");

      console.log(newData);

      newData && setData(newData);
    },
    [selectedCurrency],
  );

  const toMax = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d;
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      const search = new URLSearchParams(location.search);

      const dateFrom = search.get("datum_primjene_od");
      const dateTo = search.get("datum_primjene_do");
      const currency = JSON.parse(
        decodeURIComponent(search.get("valuta") as string),
      );

      const compareFrom =
        compareDate("day", new Date(dateFrom as string), fromDate, "same") &&
        compareDate("month", new Date(dateFrom as string), fromDate, "same") &&
        compareDate("year", new Date(dateFrom as string), fromDate, "same");

      const compareTo =
        compareDate("day", new Date(dateTo as string), toDate, "same") &&
        compareDate("month", new Date(dateTo as string), toDate, "same") &&
        compareDate("year", new Date(dateTo as string), toDate, "same");

      if (
        (currency.length === selectedCurrency.length ||
          !selectedCurrency.length) &&
        (!selectedCurrency.length ||
          currency.every(
            (value: string, index: number) => value === selectedCurrency[index],
          )) &&
        compareFrom &&
        compareTo
      )
        return;

      navigate(
        `/povijest?valuta=${encodeURIComponent(JSON.stringify(selectedCurrency))}&datum_primjene_od=${convertToDateString(
          new Date(fromDate),
          "YYYY-MM-DD",
        )}&datum_primjene_do=${convertToDateString(new Date(toDate), "YYYY-MM-DD")}`,
      );

      fetchData(
        convertToDateString(new Date(fromDate), "YYYY-MM-DD"),
        convertToDateString(new Date(toDate), "YYYY-MM-DD"),
      );
    },
    [selectedCurrency, fromDate, toDate],
  );

  const handleChange = useCallback(
    (value: string) => {
      let curr = [...selectedCurrency];

      if (curr.includes(value)) curr = curr.filter((val) => val !== value);
      else curr = [...curr, value];

      setSelectedCurrency(curr);
    },
    [selectedCurrency],
  );

  useEffect(() => {
    const d = new Date(fromDate);
    d.setDate(d.getDate() + 2);
    const compareDay = compareDate("day", d, toDate, "greater");
    const compareMonth = compareDate("month", d, toDate, "greater");
    const compareYear = compareDate("year", d, toDate, "greater");

    if (compareDay || compareMonth || compareYear)
      setFromDate(() => {
        const d = new Date(toDate);
        d.setDate(d.getDate() - 2);
        return d;
      });
  }, [toDate]);

  useEffect(() => {
    const d = new Date(toDate);
    d.setDate(d.getDate() - 2);
    const compareDay = compareDate("day", d, fromDate, "less");
    const compareMonth = compareDate("month", d, fromDate, "less");
    const compareYear = compareDate("year", d, fromDate, "less");

    if (compareDay || compareMonth || compareYear)
      setToDate(() => {
        const d = new Date(fromDate);
        d.setDate(d.getDate() + 2);
        return d;
      });
  }, [fromDate]);

  useEffect(() => {
    const search = new URLSearchParams(location.search);

    const dateFrom = search.get("datum_primjene_od");
    const dateTo = search.get("datum_primjene_do");
    const currency = JSON.parse(
      decodeURIComponent(search.get("valuta") as string),
    );

    if (!dateFrom || !dateTo || !currency) return;

    fetchData(dateFrom, dateTo);

    setFromDate(new Date(dateFrom));
    setToDate(new Date(dateTo));
    setSelectedCurrency(currency);
  }, []);

  return (
    <>
      <Container spacing="medium">
        <h2 className="text-3xl md:text-3xl text-gray-800">
          Provjera povijesti tečaja
        </h2>

        <p className="text-lg text-gray-800 max-w-5xl">
          Istražite kako su se tečajevi mijenjali kroz vrijeme. Naša arhiva
          sadrži sve povijesne podatke HNB-a, što vam omogućuje da prepoznate
          trendove i donesete bolje odluke za buduće transakcije.
        </p>
      </Container>
      <Container hasBackground spacing="medium">
        <strong className="text-xl text-red-600 max-w-5xl">Napomena</strong>

        <List content={NOTES} listType="decimal" />

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
              options={CURRENCIES}
              value={selectedCurrency}
              placeholder="Odaberi valutu..."
              onChange={handleChange}
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
        <h2 className="text-3xl md:text-3xl text-gray-800 mb-6">
          Prikaz povjesti tečaja
        </h2>

        {data.length && data[0].broj_tecajnice}

        {/* TODO - build table & chart to display the percentage of growth/fall of the selected currency. If the user wants to se the data for all currencies, display only table and growth/fall percentage since 1.1.2023. Create pagination for when the data for all curencies needs to be displayed */}
      </Container>
    </>
  );
});

export default ExchangeHistory;
