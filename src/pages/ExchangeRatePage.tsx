import React, { useState } from "react";

import Container from "../components/Container";
import DatePicker from "../components/DatePicker";

const ExchangeRatePage: React.FC = () => {
  const [date, setDate] = useState<string | undefined>();

  return (
    <>
      <Container>
        <h1 className="text-5xl mt-10 md:mt-0 font-semibold text-gray-800 flex flex-col items-start justify-start">
          Tečajna lista
        </h1>
        <p className="text-lg">
          Ovdje možete provjeriti tečajne liste češće korištenih valuta.
        </p>
        <DatePicker value={date} onChange={setDate} />
      </Container>
    </>
  );
};

export default ExchangeRatePage;
