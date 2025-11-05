import React, { useCallback, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Container from "../components/layout/Container";

import List from "../components/common/List";
import DatePicker from "../components/common/DatePicker";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Table from "../components/common/Table";

import { useGetListings } from "../hooks/useGetListing";

import { convertToDateString } from "../utils/dateUtils";

import { MOCK_CONFIG } from "../services/mock/mockData";

const NOTES = [
  `Svi tečajevi su iskazani za 1 EUR od uvođenja EUR <strong>(01.01.2023)</strong>.`,
  'Srednji tečajevi za euro u odnosu na druge valute koji su objavljeni u tečajnoj listi HNB-a imaju za cilj pružiti informaciju o tečaju eura u odnosu na druge valute u specifičnom vremenskom razdoblju na datum objave tečajne liste i kao takvi se mogu koristiti isključivo u svrhe predviđene odredbom članka 17. stavka 2. Zakona o uvođenju eura kao službene valute u Republici Hrvatskoj <strong>("Narodne novine" broj 57/2022 i 88/2022).</strong>',
  "Srednji tečajevi HNB-a nisu namijenjeni za korištenje u pravnim poslovima koji su nastali nakon uvođenja eura kao službene valute u Republici Hrvatskoj, niti bi se oni trebali koristiti, direktno ili indirektno (kao referentna vrijednost) za sklapanje bilo kojih novih pravnih poslova, već je njihovo korištenje ograničeno na pravne poslove u kojima je pozivanje na srednji tečaj HNB-a određeno prije datuma uvođenja eura, osim ako nekim propisom nije drugačije uređeno.",
  "HNB ne može biti odgovoran za korištenje podataka o srednjim tečajevima HNB-a u svrhe za koje to nije namijenjeno.",
  "Pritiskom na valutu u tablici možete provjeriti povjest tečaja odabrane valute.",
] as string[];

const headers = [
  {
    title: "Valuta",
    value: "valuta",
    isNumber: false,
  },
  {
    title: "Država",
    value: "drzava",
    isNumber: false,
  },
  {
    title: "Država ISO",
    value: "drzava_iso",
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
    title: "Šifra valute",
    value: "sifra_valute",
    isNumber: true,
  },
];

const ExchangeRate: React.FC = React.memo(() => {
  const [date, setDate] = useState<Date>(new Date());
  const [data, setData] = useState<Record<string, string>[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const { getListing, loading, error } = useGetListings();

  const fetchData = useCallback(async (date: string): Promise<void> => {
    const newData = await getListing(date);

    newData && setData(newData);
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent): void => {
      event.preventDefault();

      const selectedDate = convertToDateString(date, "YYYY-MM-DD");

      navigate(`/tecaj?datum_primjene=${selectedDate}`);

      fetchData(selectedDate);
    },
    [date]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const datumPrimjene = searchParams.get("datum_primjene");

    datumPrimjene && fetchData(datumPrimjene);

    setDate(new Date(datumPrimjene as string));
  }, []);

  return (
    <>
      <Container spacing="medium">
        <h2 className="text-3xl md:text-3xl text-gray-800">
          Provjera trenutnog tečaja
        </h2>

        <p className="text-lg text-gray-800 max-w-5xl">
          Pogledajte trenutne tečajeve i isplanirajte svoje sljedeće valutno
          poslovanje unaprijed. Naša lista ažurira se redovno izravno iz HNB-a,
          tako da uvijek imate pristup najsvježijim podacima. Donosite odluke s
          potpunim uvjerenjem i iskoristite povoljne trenutke na tržištu.
        </p>
      </Container>
      <Container hasBackground spacing="medium">
        <strong className="text-xl text-red-600 max-w-5xl">Napomena</strong>

        <List content={NOTES} listType="decimal" />

        <form
          className="w-full sm:w-xl flex flex-col gap-3 mt-6"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="datepicker"
            className="text-lg text-red-600 font-bold"
          >
            Datum primjene
          </label>
          <div className="flex gap-3 w-full sm:flex-row flex-col">
            <DatePicker
              value={date}
              onChange={setDate}
              min={new Date(2023, 0, 1)}
              max={new Date()}
              id="datepicker"
            />
            <Button variant="primary" className="max-w-none justify-center">
              Prikaži listu
            </Button>
          </div>
        </form>
      </Container>
      <Container spacing="medium">
        <h2 className="text-3xl md:text-3xl text-gray-800 mb-6">
          Prikaz tečaja
        </h2>

        {loading && <Loader />}
        {!loading && error && <p className="text-red-600 text-lg">{error}</p>}
        {!loading && data.length > 0 && (
          <>
            <div className="flex flex-col gap-3">
              <strong className="text-xl text-gray-800">
                Broj tečajnice:{" "}
                <span className="font-normal">{data[0].broj_tecajnice}</span>
              </strong>
              <strong className="text-xl text-gray-800">
                Datum primjene:{" "}
                <span className="font-normal">
                  {convertToDateString(
                    new Date(data[0].datum_primjene),
                    "DD.MM.YYYY"
                  )}
                </span>
              </strong>

              {MOCK_CONFIG.enableMockData && (
                <small>
                  Ova tablica koristi testne podatke te će biti ažurirana za
                  prikaz stvarnih podataka
                </small>
              )}
            </div>
            <Table headers={headers} data={data} />
          </>
        )}
      </Container>
    </>
  );
});

export default ExchangeRate;
