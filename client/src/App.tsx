import axios from "axios";
import React, { useEffect, useState } from "react";

import Login from "./pages/Login/Login";
import LandingPage from "./pages/01_LandingPage/01_LandingPage";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Terms from "./Terms";
import Privacy from "./Privacy";
import { usePageLocation } from "./context/sharedContext"

function App() {
  axios.defaults.withCredentials = true;
  const {loggedIn, setLoggedIn} = usePageLocation();





  return (
    <>
      {loggedIn && <NavBar />}
      <Routes>
        <Route path="/Terms" element={<Terms />} />
        <Route path="/Privacy" element={<Privacy />} />
        {loggedIn ? (
          <>
            <Route path="/" element={<LandingPage />} />
          </>
        ) : (
          <Route path="/*" element={<Login />} />
        )}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
