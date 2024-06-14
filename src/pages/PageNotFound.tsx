import React from "react";
import { Link } from "react-router-dom";

import Button from "../components/Button";

const PageNotFound: React.FC = () => {
  return (
    <div className="w-full h-dvh flex justify-center items-center gap-1 flex-col">
      <h1 className="text-7xl font-semibold text-red-600">404</h1>
      <h2 className="text-3xl text-red-600">Stranica ne postoji</h2>
      <Link to="/">
        <Button primary className="mt-10">
          Vrati se na početnu
        </Button>
      </Link>
    </div>
  );
};

export default PageNotFound;
