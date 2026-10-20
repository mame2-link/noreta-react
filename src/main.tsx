import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

import Home from "./Home";
import Stop from "./Stop";
import Trip from "./Trip";
import Search from "./Search";
import Vehicle from "./Vehicle";
import VehicleSearch from "./VehicleSearch";
import Location from "./Location";
import Place from "./Place";
import AdminInfo from "./AdminInfo";
import PrivacyPolicy from "./PrivacyPolicy";
import Terms from "./Terms";
import NotFound from "./NotFound";
// import { CookieConsentManager } from "./CookieConsent/CookieConsentManager";

const theme = createTheme({
  // typography: {
  // The default value is 14px.
  // In Chinese and Japanese the characters are usually larger,
  // so a smaller fontsize may be appropriate.
  // fontSize: 13,
  // },
  palette: {
    primary: { main: deepPurple[500] },
    secondary: { main: "#ffc400" },
    background: { default: "#f5f5f5" },
  },
  // components: {
  //   MuiCardActionArea: {
  //     styleOverrides: {
  //       root: {
  //         backgroundColor: "#fafafa",
  //       },
  //     },
  //   },
  // },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    < ThemeProvider theme={theme} >
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stop/:stopId" element={<Stop />} />
          <Route path="/trip/:tripId" element={<Trip />} />
          <Route path="/vehicle/:vehicleId" element={<Vehicle />} />
          <Route path="/search" element={<Search />} />
          <Route path="/vehicle_search" element={<VehicleSearch />} />
          <Route path="/place/:stopId" element={<Place />} />
          <Route path="/location" element={<Location />} />
          <Route path="/admn" element={<AdminInfo />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider >
    {/* <CookieConsentManager /> */}
  </StrictMode>
);
