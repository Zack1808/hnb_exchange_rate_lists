import React, { useState, useEffect } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import Container from "../components/layout/Container";

import List from "../components/common/List";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const NOTES = [
  'Srednji tečajevi za euro u odnosu na druge valute koji su objavljeni u tečajnoj listi HNB-a imaju za cilj pružiti informaciju o tečaju eura u odnosu na druge valute u specifičnom vremenskom razdoblju na datum objave tečajne liste i kao takvi se mogu koristiti isključivo u svrhe predviđene odredbom članka 17. stavka 2. Zakona o uvođenju eura kao službene valute u Republici Hrvatskoj <strong>("Narodne novine" broj 57/2022 i 88/2022).</strong>',
  "Srednji tečajevi HNB-a nisu namijenjeni za korištenje u pravnim poslovima koji su nastali nakon uvođenja eura kao službene valute u Republici Hrvatskoj, niti bi se oni trebali koristiti, direktno ili indirektno (kao referentna vrijednost) za sklapanje bilo kojih novih pravnih poslova, već je njihovo korištenje ograničeno na pravne poslove u kojima je pozivanje na srednji tečaj HNB-a određeno prije datuma uvođenja eura, osim ako nekim propisom nije drugačije uređeno.",
  "HNB ne može biti odgovoran za korištenje podataka o srednjim tečajevima HNB-a u svrhe za koje to nije namijenjeno.",
  `Izračun konverzije temelji se na srednjim tečajevima HNB-a i <strong>informativnog</strong> je karaktera.`,
  "Odabirom početne i ciljne valute i unosom iznosa možete provjeriti iznos u ciljanoj valuti.",
] as string[];

const CURRENCIES = [
  {
    value: "EUR",
    label: "Euro",
  },
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

const ExchangeConversion: React.FC = React.memo(() => {
  const [fromCurr, setFromCurr] = useState<string>("");
  const [toCurr, setToCurr] = useState<string>("");
  const [fromValue, setFromValue] = useState<number>(1);
  const [toValue, setToValue] = useState<number>();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(
      () =>
        navigate(
          `/konverzija_tecaja?valuta_iz=${fromCurr}&iznos=${fromValue}&valuta_u=${toCurr}`,
        ),
      500,
    );

    return () => clearTimeout(timer);
  }, [fromCurr, toCurr, fromValue]);

  useEffect(() => {
    const search = new URLSearchParams(location.search);

    const currFrom = search.get("valuta_iz");
    const currTo = search.get("valuta_u");
    const val = search.get("iznos");

    if (!currFrom || !currTo || !val) return;

    setFromCurr(currFrom);
    setToCurr(currTo);
    setFromValue(Number(val));
  }, []);

  return (
    <>
      <Container spacing="medium">
        <h2 className="text-3xl md:text-3xl text-gray-800">
          Konverzija valuta
        </h2>

        <p className="text-lg text-gray-800 max-w-5xl">
          Konverzija valuta temelji se na službenim podacima Hrvatske narodne
          banke (HNB). Tečajevi se koriste kao referentne vrijednosti za izračun
          konverzije i informativnog su karaktera. Za točan izračun uvijek
          provjerite aktualne podatke i primjenjive uvjete svoje banke ili
          pružatelja usluge.
        </p>
      </Container>
      <Container hasBackground spacing="medium">
        <strong className="text-xl text-red-600 max-w-5xl">Napomena</strong>

        <List content={NOTES} listType="decimal" />

        <form className="w-full md:max-w-6/12 flex items-center justify-center gap-4 mt-10 md:flex-row flex-col">
          <fieldset className="w-full flex flex-col justify-between gap-2">
            <label
              htmlFor="currencyFrom"
              className="text-lg text-red-600 font-bold"
            >
              Iz valute
            </label>
            <Select
              id="currencyFrom"
              options={CURRENCIES}
              value={fromCurr}
              onChange={setFromCurr}
            />
            <Input
              id="valueFrom"
              type="number"
              min={1}
              value={fromValue}
              onChange={(event) => setFromValue(Number(event.target.value))}
            />
          </fieldset>
          <Button variant="primary" type="button">
            <FaExchangeAlt />
          </Button>
          <fieldset className="w-full flex flex-col justify-between gap-2">
            <label
              htmlFor="currencyTo"
              className="text-lg text-red-600 font-bold"
            >
              U valutu
            </label>
            <Select
              id="currencyTo"
              options={CURRENCIES}
              value={toCurr}
              onChange={setToCurr}
            />
            <Input id="valueTo" readOnly value={toValue} />
          </fieldset>
        </form>
      </Container>
    </>
  );
});

export default ExchangeConversion;
