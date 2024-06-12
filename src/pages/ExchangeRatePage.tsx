import React, { useState } from "react";

import Container from "../components/Container";
import DatePicker from "../components/DatePicker";
import Button from "../components/Button";

import { getFormatedCurrentDate } from "../helpers/getFormatedDates";

const ExchangeRatePage: React.FC = () => {
  const [date, setDate] = useState<string | undefined>(
    getFormatedCurrentDate()
  );

  return (
    <>
      <Container spacing="medium">
        <h1 className="text-5xl mt-20 md:mt-36 font-semibold text-gray-800 flex flex-col items-start justify-start">
          Tečajna lista
        </h1>
        <p className="text-lg">
          Ovdje možete provjeriti tečajne liste češće korištenih valuta.
        </p>
      </Container>
      <Container spacing="medium" background>
        <form className="flex flex-col gap-1 w-full md:max-w-xl  justify-between ">
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
