import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { PageNotFound, ExchangeRatePage, HistoryRatePage, Home } from "./pages";

import { Navbar, Footer } from "./components";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tecaj" element={<ExchangeRatePage />} />
        <Route path="/povijest/:currency" element={<HistoryRatePage />} />
        <Route path="/povijest/:currency/:date" element={<HistoryRatePage />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
