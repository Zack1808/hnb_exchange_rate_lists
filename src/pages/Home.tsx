import React from "react";

import Hero from "../components/common/Hero";

const Home: React.FC = React.memo(() => {
  return (
    <>
      <Hero className="relative overflow-hidden before:absolute before:inset-[-500px] before:bg-[url(/bg.png)] before:bg-[length:600px_500px] before:bg-[position:10px_20px] before:z-[-10] before:-rotate-45 bg-gradient-to-br from-transparent to-white to-65%">
        Home
      </Hero>
    </>
  );
});

export default Home;
