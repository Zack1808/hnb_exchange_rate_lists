import React from "react";

import Hero from "../components/common/Hero";

const Home: React.FC = React.memo(() => {
  return (
    <>
      <Hero className="relative overflow-hidden before:absolute before:inset-[-500px] before:bg-[url(/bg.png)] before:bg-[length:600px_500px] before:bg-[position:10px_20px] before:z-[-10] before:-rotate-45 bg-gradient-to-br from-transparent to-white to-65%">
        <div className="grid gap-4 flex-1 border">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-800">
            Provjera tečaja u stvarnom vremenu
          </h1>
          <p className="text-xl text-gray-800">
            Svi službeni tečajevi Hrvatske narodne banke na jednom mjestu
          </p>

          {/* TODO - build Button component and place here */}
        </div>
        <div className="hidden relative xl:flex flex-1 border h-[400px]">
          {/* TODO - build chart component and display growth/decline of the middle rate since 1.1.2023 and growth/decline of the middle rate depending on the rate of the previous day for a randomly selected currency */}
        </div>
      </Hero>
    </>
  );
});

export default Home;
