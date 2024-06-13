import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ExchangeRatePage from "./pages/ExchangeRatePage";
import HistoryRatePage from "./pages/HistoryRatePage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tecaj" element={<ExchangeRatePage />} />
        <Route path="/povijest/:currency" element={<HistoryRatePage />} />
        <Route path="/povijest/:currency/:date" element={<HistoryRatePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
