import React from "react";

import Container from "../components/layout/Container";

import List from "../components/common/List";

const NOTES = [
  'Srednji tečajevi za euro u odnosu na druge valute koji su objavljeni u tečajnoj listi HNB-a imaju za cilj pružiti informaciju o tečaju eura u odnosu na druge valute u specifičnom vremenskom razdoblju na datum objave tečajne liste i kao takvi se mogu koristiti isključivo u svrhe predviđene odredbom članka 17. stavka 2. Zakona o uvođenju eura kao službene valute u Republici Hrvatskoj <strong>("Narodne novine" broj 57/2022 i 88/2022).</strong>',
  "Srednji tečajevi HNB-a nisu namijenjeni za korištenje u pravnim poslovima koji su nastali nakon uvođenja eura kao službene valute u Republici Hrvatskoj, niti bi se oni trebali koristiti, direktno ili indirektno (kao referentna vrijednost) za sklapanje bilo kojih novih pravnih poslova, već je njihovo korištenje ograničeno na pravne poslove u kojima je pozivanje na srednji tečaj HNB-a određeno prije datuma uvođenja eura, osim ako nekim propisom nije drugačije uređeno.",
  "HNB ne može biti odgovoran za korištenje podataka o srednjim tečajevima HNB-a u svrhe za koje to nije namijenjeno.",
  `Izračun konverzije temelji se na srednjim tečajevima HNB-a i <strong>informativnog</strong> je karaktera.`,
  "Odabirom početne i ciljne valute i unosom iznosa možete provjeriti iznos u ciljanoj valuti",
] as string[];

const ExchangeConversion: React.FC = React.memo(() => {
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
      </Container>
    </>
  );
});

export default ExchangeConversion;
