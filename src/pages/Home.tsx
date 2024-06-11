import React from "react";

// import HeroContainer from "../components/HeroContainer";
import Button from "../components/Button";

const Home: React.FC = () => {
  return (
    <>
      {/* <HeroContainer>Hello</HeroContainer> */}
      <Button primary disabled>
        Press me
      </Button>
    </>
  );
};

export default Home;
