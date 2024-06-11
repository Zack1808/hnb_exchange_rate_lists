import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
