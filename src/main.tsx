import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./Home/Home.tsx";
import Stop from "./Stop/Stop.tsx";
// import "./index.css";



ReactDOM.createRoot(document.getElementById("root")!).render(

  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stop/:stopId" element={<Stop />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
