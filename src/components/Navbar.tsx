import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="p-3 shadow-lg flex justify-center items-center fixed top-0 w-full z-50 bg-white">
      <div className="w-full md:max-w-screen-2xl flex justify-between items-center">
        <Link to="/" className="flex gap-1 items-center justify-center">
          <img src="/favicon.svg" className="w-10 md:w-14" />
          <h2 className="font-bold text-red-600 text-4xl md:text-6xl flex md:-mt-1.5">
            HNB
          </h2>
        </Link>
        <div>
          <Link
            to="/tecaj"
            className="text-lg transition hover:text-red-600 hover:bg-gray-50 p-3"
          >
            Pregledaj tečajeve
          </Link>
          <Link
            to="/povijest/USD"
            className="text-lg transition hover:text-red-600 hover:bg-gray-50 p-3"
          >
            Povijest tečaja za USD
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
