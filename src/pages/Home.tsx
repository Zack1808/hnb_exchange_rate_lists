import React, { useRef } from "react";
import { Link } from "react-router-dom";

import { Container, HeroContainer, Button } from "../components";

import { scrollIntoView } from "../helpers";

const Home: React.FC = () => {
  const exchangeRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!!!exchangeRef.current) return;
    scrollIntoView({ target: exchangeRef });
  };

  window.scrollTo(0, 0);

  return (
    <>
      <HeroContainer>
        <h1 className="text-5xl md:text-7xl font-semibold text-gray-800 font-sans">
          Provjerite tečajne liste
        </h1>

        <h2 className="text-2xl md:text-3xl text-gray-800">
          Brzo i jednosavno
        </h2>

        <Button primary className="mt-5" onClick={handleClick}>
          Saznajte više
        </Button>
      </HeroContainer>
      <Container spacing="big" ref={exchangeRef} background>
        <h2 className="text-3xl text-gray-800 font-semibold">Trenutni tečaj</h2>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 w-full">
          <p className="text-lg text-gray-800 max-w-5xl">
            Želite li biti u korak s najnovijim promjenama tečajeva? Provjerite
            našu trenutnu tečajnu listu i osigurajte si najbolji mogući tečaj za
            svoje financijske transakcije. Budite informirani i donosite pametne
            odluke o svojim valutnim operacijama. Neka vaš novac radi za vas uz
            našu ažuriranu tečajnu listu!
          </p>

          <Link to="/tecaj">
            <Button primary>Projverite tečajeve</Button>
          </Link>
        </div>
      </Container>
      <Container spacing="big">
        <h2 className="text-3xl text-gray-800 font-semibold">
          Tečaj američkog dolara
        </h2>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 w-full">
          <p className="text-lg text-gray-800 max-w-5xl">
            Interesira vas američki dolar? Zavirite u naše tečajne liste i
            istražite fascinantne fluktuacije vrijednosti dolara tijekom
            vremena. Budite u koraku s promjenama i donosite informirane odluke.
          </p>

          <Link to="/povijest/USD">
            <Button primary>Provjerite tečaj</Button>
          </Link>
        </div>
      </Container>
    </>
  );
};

export default Home;
