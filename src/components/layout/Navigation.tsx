import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = React.memo(() => {
  return (
    <header className="md:py-3 py-5 px-3 shadow-lg flex justify-center items-center top-0 w-full z-40 bg-white">
      <div className="w-full md:max-w-screen-2xl flex justify-between items-center">
        <Link to="/">
          <div className="flex flex-col items-center">
            <p className="font-bold text-red-600 text-3xl md:text-5xl flex p-0">
              HNB
            </p>
            <small className="text-[.6rem] text-red-600 p-0 hidden md:flex">
              Hrvatska Narodna Banka
            </small>
          </div>
        </Link>

        <nav className="flex justify-end left-0 fixed md:static bg-black/40 md:bg-transparent w-full gap-3">
          <Link to="/">Početna</Link>
          <Link to="/tecaj">Današnji tečajevi</Link>
          <Link to="/povijest">Povjest tečajeva</Link>
        </nav>
      </div>
    </header>
  );
});

export default Navigation;
