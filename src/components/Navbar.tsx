import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ImMenu } from "react-icons/im";
import { FaXmark } from "react-icons/fa6";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <nav className="md:py-3 py-5 px-3 shadow-lg flex justify-center items-center fixed top-0 w-full z-40 bg-white">
      <div className="w-full md:max-w-screen-2xl flex justify-between items-center">
        <Link to="/" className="flex gap-1 items-center justify-center">
          <img src="/favicon.svg" className="w-10 md:w-14" />
          <h2 className="font-bold text-red-600 text-4xl md:text-6xl flex md:-mt-1.5">
            HNB
          </h2>
        </Link>

        {/* Big screen */}
        <div className="md:flex hidden">
          <Link
            to="/"
            className="text-lg transition hover:text-red-600 hover:bg-gray-50 p-3"
          >
            Početna
          </Link>
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

        {/* Small screen */}
        <ImMenu
          className="md:hidden flex text-4xl text-red-600"
          onClick={toggleOpen}
        />

        {isOpen && (
          <div
            className="absolute top-0 left-0 w-full h-dvh bg-black/20 md:hidden"
            onClick={toggleOpen}
          >
            <div
              className={`bg-white absolute left-0 top-0 bottom-0 px-8 py-5 flex flex-col gap-10 items-end scale-x-0 origin-left ${
                isOpen && "animate-menu-open"
              }`}
            >
              <div
                className={`flex justify-between w-full opacity-0 ${
                  isOpen && "animate-menu-links-open"
                }`}
              >
                <Link
                  to="/"
                  className="flex gap-0 items-center justify-center "
                >
                  <img src="/favicon.svg" className="w-7 md:w-14" />
                  <h2 className="font-bold text-red-600 text-2xl flex ">HNB</h2>
                </Link>
                <FaXmark className="text-4xl text-red-600" />
              </div>
              <div
                className={`flex flex-col gap-2 opacity-0 ${
                  isOpen && "animate-menu-links-open"
                }`}
              >
                <Link to="/" className="text-lg py-3">
                  Početna
                </Link>
                <Link to="/tecaj" className="text-lg py-3">
                  Pregledaj tečajeve
                </Link>
                <Link to="/povijest/USD" className="text-lg py-3">
                  Povijest tečaja za USD
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
