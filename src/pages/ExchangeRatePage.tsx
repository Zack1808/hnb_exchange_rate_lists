import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Container from "../components/Container";
import DatePicker from "../components/DatePicker";
import Button from "../components/Button";

import { getFormatedCurrentDate } from "../helpers/getFormatedDates";

const ExchangeRatePage: React.FC = () => {
  const [date, setDate] = useState<string | undefined>("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    if (!!!search.size) {
      setDate(getFormatedCurrentDate());
      return;
    }
    const urlDate = search.get("datum-primjene");
    if (!!!urlDate) return;
    setDate(urlDate);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/tecaj?datum-primjene=${date}`);
  };

  return (
    <>
      <Container spacing="medium">
        <h1 className="text-5xl mt-20 md:mt-36 font-semibold text-gray-800 flex flex-col items-start justify-start">
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
    </>
  );
};

export default ExchangeRatePage;
