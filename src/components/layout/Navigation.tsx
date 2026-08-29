import React, { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMenuSharp } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";

import Button from "../common/Button";

import { convertToDateString } from "../../utils/dateUtils";

const Navigation: React.FC = React.memo(() => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const location = useLocation();

  const today = new Date();

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const toggleOpen = useCallback(() => {
    setMenuOpen((prevState) => !prevState);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) closeMenu();
    },
    [],
  );

  const historyParams = new URLSearchParams({
    valuta: JSON.stringify(["AUD"]),
    datum_primjene_od: convertToDateString(twoDaysAgo, "YYYY-MM-DD"),
    datum_primjene_do: convertToDateString(today, "YYYY-MM-DD"),
    prikaz: "table",
  });

  const conversionParams = new URLSearchParams({
    valuta_iz: "EUR",
    iznos: "1",
    valuta_u: "AUD",
  });

  const navLinkClasses = `py-5 px-10 md:py-2 md:px-6 max-w-none w-full md:w-auto justify-start md:justify-center opacity-100 transition-colors`;

  const headerClasses = `md:py-3 py-5 px-3 shadow-lg flex justify-center items-center top-0 w-full z-40 bg-white ${location.pathname === "/" ? "fixed" : "sticky"}`;

  const navClasses = `flex justify-end left-0 fixed md:static bg-black/40 md:bg-transparent w-full bottom-0 top-0 transition ${
    menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
  } md:opacity-100 md:visible`;

  useEffect(() => {
    closeMenu();
  }, [location.pathname, location.search]);

  return (
    <header className={headerClasses}>
      <div className="w-full md:max-w-screen-2xl flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={closeMenu}
          aria-label="Hrvatska Narodna Banka"
        >
          <img
            src="/favicon.svg"
            alt="Hrvatska Narodna Banka"
            className="w-10 md:w-16"
          />
          <div className="flex flex-col items-center">
            <p className="font-bold text-red-600 text-3xl md:text-5xl flex p-0">
              HNB
            </p>
            <small className="text-[.6rem] text-red-600 p-0 hidden md:flex">
              Hrvatska Narodna Banka
            </small>
          </div>
        </Link>

        <nav
          className={navClasses}
          onClick={handleBackdropClick}
          aria-label="Glavna navigacija"
        >
          <div
            className={`flex flex-col md:flex-row bg-white h-dvh md:h-auto w-fit p-3 md:p-0 origin-right`}
          >
            <Button
              type="button"
              onClick={toggleOpen}
              className="md:hidden ml-auto mb-5 px-2 text-3xl text-red-600"
              aria-label="Zatvori izbornik"
            >
              <FaXmark className={`text-4xl text-red-600`} aria-hidden="true" />
            </Button>

            <Button to="/" className={navLinkClasses}>
              Početna
            </Button>
            <Button
              to={`/tecaj?datum_primjene=${convertToDateString(
                today,
                "YYYY-MM-DD",
              )}`}
              className={navLinkClasses}
            >
              Provjera tečajeva
            </Button>
            <Button
              to={`/povijest?${historyParams.toString()}`}
              className={navLinkClasses}
            >
              Povjest tečajeva
            </Button>
            <Button
              to={`/konverzija_tecaja?${conversionParams.toString()}`}
              className={navLinkClasses}
            >
              Konverzija valuta
            </Button>
          </div>
        </nav>

        <Button
          className="md:hidden flex !text-3xl text-red-600 py-0"
          onClick={toggleOpen}
          aria-label={menuOpen ? "Zatvori izbornik" : "Otvori izbornik"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          <IoMenuSharp aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
});

export default Navigation;
