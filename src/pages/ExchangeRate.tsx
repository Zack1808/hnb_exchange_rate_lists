import React from "react";

import Container from "../components/layout/Container";

import List from "../components/common/List";
import DatePicker from "../components/common/DatePicker";

const NOTES = [
  `Svi tečajevi su iskazani za 1 EUR od uvođenja EUR <strong>(01.01.2023)</strong>.`,
  'Srednji tečajevi za euro u odnosu na druge valute koji su objavljeni u tečajnoj listi HNB-a imaju za cilj pružiti informaciju o tečaju eura u odnosu na druge valute u specifičnom vremenskom razdoblju na datum objave tečajne liste i kao takvi se mogu koristiti isključivo u svrhe predviđene odredbom članka 17. stavka 2. Zakona o uvođenju eura kao službene valute u Republici Hrvatskoj <strong>("Narodne novine" broj 57/2022 i 88/2022).</strong>',
  "Srednji tečajevi HNB-a nisu namijenjeni za korištenje u pravnim poslovima koji su nastali nakon uvođenja eura kao službene valute u Republici Hrvatskoj, niti bi se oni trebali koristiti, direktno ili indirektno (kao referentna vrijednost) za sklapanje bilo kojih novih pravnih poslova, već je njihovo korištenje ograničeno na pravne poslove u kojima je pozivanje na srednji tečaj HNB-a određeno prije datuma uvođenja eura, osim ako nekim propisom nije drugačije uređeno.",
  "HNB ne može biti odgovoran za korištenje podataka o srednjim tečajevima HNB-a u svrhe za koje to nije namijenjeno.",
  "Pritiskom na valutu u tablici možete provjeriti povjest tečaja odabrane valute.",
] as string[];

const ExchangeRate: React.FC = React.memo(() => {
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

        <DatePicker value={new Date()} />
      </Container>
      <Container spacing="medium">
        <h2 className="text-3xl md:text-3xl text-gray-800 font-bold mb-6">
          Prikaz tečaja
        </h2>

        {/* TODO - Create Table component to display the fetched data */}
      </Container>
    </>
  );
});

export default ExchangeRate;
