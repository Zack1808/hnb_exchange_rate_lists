import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ExchangeRatePage from "./pages/ExchangeRatePage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tecaj" element={<ExchangeRatePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
