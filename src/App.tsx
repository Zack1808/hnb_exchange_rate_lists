import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ExchangeRate from "./pages/ExchangeRate";
import ExchangeHistory from "./pages/ExchangeHistory";
import PageNotFound from "./pages/PageNotFound";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tecaj" element={<ExchangeRate />} />
          <Route path="/povijest" element={<ExchangeHistory />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
