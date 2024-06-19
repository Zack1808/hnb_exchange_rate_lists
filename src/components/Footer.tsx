import React from "react";
import { FaCopyright } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-red-600 text-white flex justify-center items-center px-3 py-10 font-semibold gap-3">
      <FaCopyright /> JPN
    </footer>
  );
};

export default Footer;
