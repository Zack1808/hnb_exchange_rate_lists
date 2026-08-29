import React from "react";
import {
  FaCopyright,
  FaFacebookSquare,
  FaLinkedin,
  FaInstagramSquare,
  FaYoutube,
  FaEnvelope,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

import Button from "../common/Button";

const Footer: React.FC = () => {
  return (
    <footer className="bg-red-600 text-white flex flex-col justify-center items-center px-3 py-10 font-semibold gap-3 divide-y-1 divide-white">
      <div className="flex md:flex-row flex-col w-full md:divide-x-1 divide-white md:max-w-screen-2xl md:divide-y-0 divide-y-1">
        <div className="w-full md:pb-5 md:pt-0 py-5 px-3">
          <h6 className="text-white font-bold uppercase text-md mb-2">
            Hrvatska Narodna Banka
          </h6>
          <p className="text-white text-sm">Trg hrvatskih velikana 3</p>
          <p className="text-white text-sm">10000 Zagreb</p>
          <p className="text-white text-sm">Republika Hrvatska</p>
          <p className="text-white text-sm flex gap-2">
            Telefon:
            <Button
              variant="primary"
              href="tel:+38514564555"
              className="p-0! text-sm decoration-solid underline border-none"
            >
              +385 1 45 64 555
            </Button>
          </p>

          <Button
            variant="primary"
            className="px-0! mt-6 decoration-solid! underline border-none"
          >
            Obratite nam se
          </Button>
        </div>
        <div className="w-full md:pb-5 md:pt-0 py-5 px-3">
          <Button
            variant="primary"
            className="text-sm py-2! px-2! border-none"
            href="https://www.hnb.hr/mapa-sadrzaja"
            target="_blank"
          >
            Mapa Sadržaja
          </Button>
          <Button
            variant="primary"
            className="text-sm py-2! px-2! border-none"
            href="https://www.hnb.hr/novo-i-azurirano"
            target="_blank"
          >
            Novo i ažurno
          </Button>
          <Button
            variant="primary"
            className="text-sm py-2! px-2! border-none"
            href="https://www.hnb.hr/korisni-linkovi"
            target="_blank"
          >
            Korisni linkovi
          </Button>
          <Button
            variant="primary"
            className="text-sm py-2! px-2! border-none"
            href="https://www.hnb.hr/uvjeti-koristenja"
            target="_blank"
          >
            Uvijeti korištenja
          </Button>
          <Button
            variant="primary"
            className="text-sm py-2! px-2! border-none"
            href="https://www.hnb.hr/zastita-osobnih-podataka"
            target="_blank"
          >
            Zaštita osobnih podataka
          </Button>
          <Button
            variant="primary"
            className="text-sm py-2! px-2! border-none"
            href="https://www.hnb.hr/pristupacnost"
            target="_blank"
          >
            Pristupačnost
          </Button>
          <Button
            variant="primary"
            className="text-sm py-2! px-2! border-none"
            href="https://www.hnb.hr/cookiepolicy"
            target="_blank"
          >
            Politika korištenja kolačića
          </Button>
        </div>
        <div className="w-full md:pb-5 md:pt-0 py-5 px-3">
          <Button
            className="text-2xl! py-2! px-2! border-none"
            href="https://www.facebook.com/hnb.hr/"
            target="_blank"
            variant="primary"
          >
            <FaFacebookSquare aria-hidden="true" />{" "}
            <span className="text-sm">Facebook</span>
          </Button>
          <Button
            className="text-2xl!
             py-2! px-2! border-none"
            href="https://www.linkedin.com/company/croatian-national-bank"
            target="_blank"
            variant="primary"
          >
            <FaLinkedin aria-hidden="true" />{" "}
            <span className="text-sm">LinkedIn</span>
          </Button>
          <Button
            className="text-2xl!
             py-2! px-2! border-none"
            href="https://www.instagram.com/hrvatska_narodna_banka/"
            target="_blank"
            variant="primary"
          >
            <FaInstagramSquare aria-hidden="true" />{" "}
            <span className="text-sm">Instagram</span>
          </Button>
          <Button
            className="text-2xl!
             py-2! px-2! border-none"
            href="https://x.com/HNB_HR"
            target="_blank"
            variant="primary"
          >
            <FaSquareXTwitter aria-hidden="true" />{" "}
            <span className="text-sm">X</span>
          </Button>
          <Button
            className="text-2xl!
             py-2! px-2! border-none"
            href="https://www.youtube.com/channel/UCotSpU9O5WMhPedWsR2jlXg"
            target="_blank"
            variant="primary"
          >
            <FaYoutube aria-hidden="true" />{" "}
            <span className="text-sm">YouTube</span>
          </Button>
          <Button
            className="text-2xl!
             py-2! px-2! border-none"
            href="https://www.hnb.hr/e-mail-obavijesti"
            target="_blank"
            variant="primary"
          >
            <FaEnvelope aria-hidden="true" />{" "}
            <span className="text-sm">RSS/E-mail obavijesti</span>
          </Button>
        </div>
      </div>

      <p className="flex w-full divide-x-1 divide-white md:max-w-screen-2xl flex-wrap py-5 px-3">
        <strong>Napomena:</strong> Ova stranica nije službena internetska
        stranica Hrvatske narodne banke (HNB). Podaci prikazani na ovoj stranici
        preuzeti su iz javno dostupnih izvora HNB-a. Sva prava na podatke i
        sadržaj pripadaju Hrvatskoj narodnoj banci. Za službene i ažurirane
        informacije posjetite službenu internetsku stranicu HNB-a.
      </p>
      <span className="flex gap-3 font-semibold items-center pt-6">
        <FaCopyright aria-hidden="true" /> JPN
      </span>
    </footer>
  );
};

export default Footer;
