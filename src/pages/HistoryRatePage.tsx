import React, { useState } from "react";

import Container from "../components/Container";
import DatePicker from "../components/DatePicker";
import Button from "../components/Button";
import Input from "../components/Input";

import { getFormatedCurrentDate } from "../helpers/getFormatedDates";

const HistoryRatePage: React.FC = () => {
  const [date, setDate] = useState<string>("");
  const [daysBackwards, setDaysBackwards] = useState<number>(2);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysBackwards(Number(event.target.value));
  };

  return (
    <>
      <Container spacing="medium">
        <h1 className="text-5xl mt-20 md:mt-28 font-semibold text-gray-800 flex flex-col items-start justify-start">
          Povijest tečaja
        </h1>
        <p className="text-lg text-gray-800">
          Ovdje možete provjeriti povijest tečajne liste za odabranu valutu.
        </p>
      </Container>
      <Container spacing="medium" background>
        <h3 className="text-xl font-semibold text-red-600">Napomena</h3>
        <p className="text-lg text-gray-800">
          Ovdje se prikazuju samo tečajne liste od uvođenja eura (01.01.2023).
          Podaci prije 01.01.2023 se neće prikazivati.
          <br />
          Također mogu se prikazat podaci do 60 dana unazad od odabranog datuma,
          sve dok taj datum ne prelazi 01.01.2023.
        </p>
        <form
          className="flex mt-5 gap-5 w-full justify-start items-end flex-col md:flex-row md"
          onSubmit={handleSubmit}
        >
          <fieldset className="flex gap-1 flex-col w-full md:max-w-sm">
            <label htmlFor="datum-primjene" className="text-lg">
              Datum Primjene
            </label>
            <DatePicker
              value={date}
              onChange={setDate}
              min={"2023-01-01"}
              max={getFormatedCurrentDate()}
              name="datum-primjene"
              id="datum-primjene"
            />
          </fieldset>
          <fieldset className="flex gap-1 flex-col w-full md:max-w-sm">
            <label htmlFor="broj-unazad" className="text-lg">
              Prikaži liste unazad:
            </label>
            <Input
              type="number"
              value={daysBackwards}
              onChange={handleChange}
            />
          </fieldset>
          <Button primary className="justify-center w-full md:w-auto">
            Prikaži povijest
          </Button>
        </form>
      </Container>
    </>
  );
};

export default HistoryRatePage;
