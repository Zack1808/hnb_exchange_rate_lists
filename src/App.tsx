import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ExchangeRate from "./pages/ExchangeRate";
import ExchangeHistory from "./pages/ExchangeHistory";
import PageNotFound from "./pages/PageNotFound";

import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tecaj" element={<ExchangeRate />} />
          <Route path="/povijest" element={<ExchangeHistory />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
