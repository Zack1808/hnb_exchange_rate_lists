import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ExchangeRatePage from "./pages/ExchangeRatePage";
import HistoryRatePage from "./pages/HistoryRatePage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tecaj" element={<ExchangeRatePage />} />
        <Route path="/povijest/:currency" element={<HistoryRatePage />} />
        <Route path="/povijest/:currency/:date" element={<HistoryRatePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
