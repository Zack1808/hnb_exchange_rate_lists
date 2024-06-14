import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Container, Table, Button, DatePicker, Loader } from "../components";

import { getFormatedCurrentDate } from "../helpers";

import { useGetListings } from "../hooks/useGetListings";

const ExchangeRatePage: React.FC = () => {
  const [date, setDate] = useState<string>(getFormatedCurrentDate());
  const [exchangeRateList, setExchangeRateList] = useState<
    Record<string, any>[]
  >([]);

  const headers = [
    {
      title: "Valuta",
      value: "valuta",
    },
    {
      title: "Država",
      value: "drzava",
    },
    {
      title: "Država ISO",
      value: "drzava_iso",
    },
    {
      title: "Kupovni tečaj",
      value: "kupovni_tecaj",
    },
    {
      title: "Srednji tečaj",
      value: "srednji_tecaj",
    },
    {
      title: "Prodajni tečaj",
      value: "prodajni_tecaj",
    },
    {
      title: "Šifra valute",
      value: "sifra_valute",
    },
  ];

  const links = [
    {
      target: "valuta",
      isCurrentDate: date === getFormatedCurrentDate(),
      date,
    },
  ];

  const tableColors = (index: number) => {
    return index % 2 === 0 ? "bg-gray-100" : "bg-gray-200";
  };

  const filter = ["drzava", "drzava_iso", "sifra_valute", "valuta"];

  const location = useLocation();
  const navigate = useNavigate();

  const { loading, getListing, error } = useGetListings();

  const fetchList = async (currentDate: string) => {
    const list = await getListing(currentDate);
    setExchangeRateList(list);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = new URLSearchParams(location.search);
    if (
      date === search.get("datum-primjene") ||
      (date === getFormatedCurrentDate() && !!!search.size)
    )
      return;
    navigate(`/tecaj?datum-primjene=${date}`);
    fetchList(date);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const search = new URLSearchParams(location.search);
    if (!!!search.size) {
      fetchList(getFormatedCurrentDate());
      return;
    }
    const urlDate = search.get("datum-primjene");
    if (!!!urlDate) return;
    setDate(urlDate);
    fetchList(urlDate);
  }, []);

  return (
    <>
      <Container spacing="medium">
        <h1 className="text-5xl mt-20 font-semibold text-gray-800 flex flex-col items-start justify-start">
          Tečajna lista
        </h1>
        <p className="text-lg text-gray-800">
          Ovdje možete provjeriti tečajne liste češće korištenih valuta.
        </p>
      </Container>

      <Container spacing="medium" background>
        <h3 className="text-xl font-semibold text-red-600">Napomena</h3>
        <p className="text-lg text-gray-800">
          Ovdje se prikazuju samo tečajne liste od uvođenja eura (01.01.2023).
          Podaci prije 01.01.2023 se neće prikazivati.
          <br />
          Također pritiskom na valutu u tablici možete otvoriti povjest tečaja
          odabrane valute sa odabranim datumom.
        </p>
        <form
          className="flex flex-col mt-5 gap-1 w-full md:max-w-xl justify-between"
          onSubmit={handleSubmit}
        >
          <label htmlFor="datum-primjene" className="text-lg">
            Datum Primjene
          </label>
          <fieldset className="flex gap-5 flex-col md:flex-row">
            <DatePicker
              value={date}
              onChange={setDate}
              min={"2023-01-01"}
              max={getFormatedCurrentDate()}
              name="datum-primjene"
              id="datum-primjene"
            />
            <Button primary className="justify-center">
              Prikaži listu
            </Button>
          </fieldset>
        </form>
      </Container>

      <Container spacing="medium">
        {loading && <Loader />}
        {!loading && error && <p className="text-red-600 text-lg">{error}</p>}
        {!loading && exchangeRateList.length > 0 && (
          <>
            <h4 className="text-gray-800 font-semibold text-xl">
              Broj tečajnice:{" "}
              <span className="font-medium text-lg">
                {exchangeRateList[0].broj_tecajnice}
              </span>
            </h4>
            <h4 className="text-gray-800 font-semibold text-xl">
              Datum primjene:{" "}
              <span className="font-medium text-lg">
                {new Date(
                  exchangeRateList[0].datum_primjene
                ).toLocaleDateString()}
              </span>
            </h4>
            <Table
              data={exchangeRateList}
              headers={headers}
              sortable
              colorRow={tableColors}
              linkCols={links}
              filterable
              filterableKeys={filter}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default ExchangeRatePage;
