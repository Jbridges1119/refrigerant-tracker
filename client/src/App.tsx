
import axios from "axios";
import React, { useEffect, useState } from "react";

import Login from './pages/Login/Login'
import LandingPage from './pages/01_LandingPage/01_LandingPage'
import {  Routes, Route } from "react-router-dom";
import NavBar from "./NavBar"
import Footer from "./Footer";
import Terms from "./Terms"
import Privacy from "./Privacy"

function App() {
  axios.defaults.withCredentials = true;
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() =>{
    axios.get("http://localhost:3005/users/login")
    .then(info => {
      setLoggedIn(info.data.loggedIn) 
    })
    .catch((err) => {
      console.log(err)
    });
  }, [])

  const BoxSX = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    alignItems: "space-between",
    alignContent: 'space-between',
    backgroundColor: '#F5F7FF',
    minHeight: '10000px'
  };

  return (
   <>
      {loggedIn && <NavBar />}
      <Routes>
      <Route path="/Terms" element={<Terms/>} />
      <Route path="/Privacy" element={<Privacy/>} />
      {loggedIn ? 
      <>
      <Route path="/" element={<LandingPage />} />
     
    
    
    
    
    
    
      
      </>
    : <Route path="/*" element={<Login setLoggedIn={setLoggedIn}/>} />
    }
    </Routes>
    <Footer/>
    
    
    </>
  );
}

export default App;
