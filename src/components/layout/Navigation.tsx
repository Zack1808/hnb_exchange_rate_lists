import React, { useState, useCallback, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMenuSharp } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";

import Button from "../common/Button";

import { convertToDateString } from "../../utils/dateUtils";

const Navigation: React.FC = React.memo(() => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const navRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  const toggleOpen = useCallback(() => {
    setMenuOpen((prevState) => !prevState);
  }, []);

  const handleClick = useCallback((event: React.MouseEvent) => {
    if (event.target === navRef.current) {
      setMenuOpen(false);
    }
  }, []);

  const headerClasses = useMemo(
    () =>
      `md:py-3 py-5 px-3 shadow-lg flex justify-center items-center ${
        location.pathname === "/" ? "fixed" : "sticky"
      } top-0 w-full z-40 bg-white`.trim(),
    [location.pathname]
  );

  const navClasses = useMemo(
    () =>
      `flex justify-end left-0 fixed md:static bg-black/40 md:bg-transparent w-full bottom-0 top-0 transition ${
        menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } md:opacity-100 md:visible`,
    [menuOpen]
  );

  const getLinkClasses = useCallback(
    (delay: boolean = true) =>
      `py-5 px-10 md:py-2 md:px-6 opacity-0 md:opacity-100 max-w-none ${
        menuOpen && delay ? "opacity-100" : ""
      }`,
    [menuOpen]
  );

  const closeButtonClasses = useMemo(
    () => `opacity-0 ml-auto mb-5 md:hidden px-2 ${menuOpen && "opacity-100"}`,
    [menuOpen]
  );

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <header className={headerClasses}>
      <div className="w-full md:max-w-screen-2xl flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.svg" className="w-10 md:w-16" />
          <div className="flex flex-col items-center">
            <p className="font-bold text-red-600 text-3xl md:text-5xl flex p-0">
              HNB
            </p>
            <small className="text-[.6rem] text-red-600 p-0 hidden md:flex">
              Hrvatska Narodna Banka
            </small>
          </div>
        </Link>

        <nav ref={navRef} className={navClasses} onClick={handleClick}>
          <div
            className={`flex flex-col md:flex-row bg-white h-dvh md:h-auto w-fit p-3 md:p-0 origin-right`}
          >
            <Button onClick={toggleOpen} className={closeButtonClasses}>
              <FaXmark
                className={`text-4xl text-red-600`}
                aria-label="Close menu"
              />
            </Button>

            <Button to="/" className={getLinkClasses()} onClick={closeMenu}>
              Početna
            </Button>
            <Button
              to={`/tecaj?datum_primjene=${convertToDateString(
                new Date(),
                "YYYY-MM-DD"
              )}`}
              className={getLinkClasses()}
              onClick={closeMenu}
            >
              Današnji tečajevi
            </Button>
            <Button
              to={`/povijest?valuta=ALL&datum_primjene_od=${convertToDateString(
                new Date(new Date().setDate(new Date().getDate() - 2)),
                "YYYY-MM-DD"
              )}&datum_primjene_do=${convertToDateString(
                new Date(),
                "YYYY-MM-DD"
              )}`}
              className={getLinkClasses()}
              onClick={closeMenu}
            >
              Povjest tečajeva
            </Button>
          </div>
        </nav>

        <Button
          className="md:hidden flex !text-3xl text-red-600 py-0"
          onClick={toggleOpen}
        >
          <IoMenuSharp aria-label="Open menu" />
        </Button>
      </div>
    </header>
  );
});

export default Navigation;
