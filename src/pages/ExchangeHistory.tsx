import React from "react";

import Container from "../components/layout/Container";

import List from "../components/common/List";
import Select from "../components/common/Select";

const NOTES = [
  `Svi tečajevi su iskazani za 1 EUR od uvođenja EUR <strong>(01.01.2023)</strong>.`,
  'Srednji tečajevi za euro u odnosu na druge valute koji su objavljeni u tečajnoj listi HNB-a imaju za cilj pružiti informaciju o tečaju eura u odnosu na druge valute u specifičnom vremenskom razdoblju na datum objave tečajne liste i kao takvi se mogu koristiti isključivo u svrhe predviđene odredbom članka 17. stavka 2. Zakona o uvođenju eura kao službene valute u Republici Hrvatskoj <strong>("Narodne novine" broj 57/2022 i 88/2022).</strong>',
  "Srednji tečajevi HNB-a nisu namijenjeni za korištenje u pravnim poslovima koji su nastali nakon uvođenja eura kao službene valute u Republici Hrvatskoj, niti bi se oni trebali koristiti, direktno ili indirektno (kao referentna vrijednost) za sklapanje bilo kojih novih pravnih poslova, već je njihovo korištenje ograničeno na pravne poslove u kojima je pozivanje na srednji tečaj HNB-a određeno prije datuma uvođenja eura, osim ako nekim propisom nije drugačije uređeno.",
  "HNB ne može biti odgovoran za korištenje podataka o srednjim tečajevima HNB-a u svrhe za koje to nije namijenjeno.",
  "Pritiskom na valutu u tablici možete provjeriti povjest tečaja odabrane valute.",
] as string[];

const ExchangeHistory: React.FC = React.memo(() => {
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

        <Select options={[]} value="" />

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
