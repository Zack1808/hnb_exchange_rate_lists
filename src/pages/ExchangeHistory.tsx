import React, { useState, useMemo } from "react";

import Container from "../components/layout/Container";

import List from "../components/common/List";
import Select from "../components/common/Select";
import DatePicker from "../components/common/DatePicker";

const NOTES = [
  `Svi tečajevi su iskazani za 1 EUR od uvođenja EUR <strong>(01.01.2023)</strong>.`,
  'Srednji tečajevi za euro u odnosu na druge valute koji su objavljeni u tečajnoj listi HNB-a imaju za cilj pružiti informaciju o tečaju eura u odnosu na druge valute u specifičnom vremenskom razdoblju na datum objave tečajne liste i kao takvi se mogu koristiti isključivo u svrhe predviđene odredbom članka 17. stavka 2. Zakona o uvođenju eura kao službene valute u Republici Hrvatskoj <strong>("Narodne novine" broj 57/2022 i 88/2022).</strong>',
  "Srednji tečajevi HNB-a nisu namijenjeni za korištenje u pravnim poslovima koji su nastali nakon uvođenja eura kao službene valute u Republici Hrvatskoj, niti bi se oni trebali koristiti, direktno ili indirektno (kao referentna vrijednost) za sklapanje bilo kojih novih pravnih poslova, već je njihovo korištenje ograničeno na pravne poslove u kojima je pozivanje na srednji tečaj HNB-a određeno prije datuma uvođenja eura, osim ako nekim propisom nije drugačije uređeno.",
  "HNB ne može biti odgovoran za korištenje podataka o srednjim tečajevima HNB-a u svrhe za koje to nije namijenjeno.",
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
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d;
  });

  const fromMin = useMemo(() => {
    const d = new Date(toDate);
    d.setDate(d.getDate() + 2);
    return d;
  }, [toDate]);

  const toMax = useMemo(() => {
    const d = new Date(fromDate);
    d.setDate(d.getDate() - 2);
    return d;
  }, [fromDate]);

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

        <form className="w-full md:max-w-6/12 flex flex-col gap-4">
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
              onChange={setSelectedCurrency}
              id="currencySelect"
            />
          </fieldset>
          <fieldset className="flex flex-col gap-2 items-start">
            <label htmlFor="toDate" className="text-lg text-red-600 font-bold">
              Datum do
            </label>
            <DatePicker
              value={toDate}
              onChange={setToDate}
              min={new Date(2023, 0, 1)}
              max={toMax}
              id="toDate"
            />
          </fieldset>
          <fieldset className="flex flex-col gap-2 items-start">
            <label
              htmlFor="fromDate"
              className="text-lg text-red-600 font-bold"
            >
              Datum od
            </label>
            <DatePicker
              value={fromDate}
              onChange={setFromDate}
              min={fromMin}
              max={new Date()}
              id="fromDate"
            />
          </fieldset>
        </form>

        {/* TODO - build form with selection on what rate the user wants to see and which period */}
      </Container>
      <Container spacing="medium">
        <h2 className="text-3xl md:text-3xl text-gray-800 mb-6">
          Prikaz povjesti tečaja
        </h2>

        {/* TODO - build table & chart to display the percentage of growth/fall of the selected currency. If the user wants to se the data for all currencies, display only table and growth/fall percentage since 1.1.2023. Create pagination for when the data for all curencies needs to be displayed */}
      </Container>
    </>
  );
});

export default ExchangeHistory;
