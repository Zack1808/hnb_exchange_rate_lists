import React from "react";

import Button from "../components/common/Button";

const PageNotFound: React.FC = React.memo(() => {
  return (
    <div className="h-[100dvh] w-full flex items-center justify-center flex-col gap-3">
      <strong className="text-9xl text-red-600">404</strong>
      <strong className="text-3xl text-red-600">Stranica nije pronađena</strong>
      <p className="text-lg text-gray-800 mt-10 mb-5">
        Provjerite jeste li ispravno unijeli adresu ili se vratite na početnu
        stranicu HNB-a.
      </p>
      <Button to="/" variant="primary">
        Povratak na početnu
      </Button>
    </div>
  );
});

export default PageNotFound;
