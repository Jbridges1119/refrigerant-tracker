import { Button, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./styles/App.css";
import Login from './pages/Login/Login'
import LandingPage from './pages/LandingPage/LandingPage'
import { log } from "console";

axios.defaults.withCredentials = true; //

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

 


  useEffect(() =>{
    axios.get("http://localhost:3005/users/login")
    .then(info => {
      console.log("test",info);
      setLoggedIn(info.data.loggedIn) 
    })
    .catch((err) => {
      console.log(err)
    });
  }, [])

  return (
    <div className="App">
      {loggedIn ? 
      <LandingPage />
    
    
    
    
    
    
    
    : <Login setLoggedIn={setLoggedIn}/>
    }
    </div>
  );
}

export default App;
