import { Button, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

type props = {
  setLoggedIn: (loggedIn: boolean) => void;
}

const Login: React.FC<props> = ({setLoggedIn}) => {
  const [email, setEmail] = useState("jbridges1119@gmail.com");
  const [password, setPassword] = useState("qqqqqqqq");
  const [loginStatus, setLoginStatus] = useState("");



  const login = () => {
    axios
      .post("http://localhost:3005/users/login", {
        email: email,
        password: password,
      })
      .then((data) => {
        if (data.data.error) {
          setLoginStatus(data.data.error);
          console.log(data.data.error);
        } else {
          setLoginStatus("")
          console.log(data);
          
        }
      });
  };
 
  return (
    <div className="App">
      <Stack>
      <Typography variant="body1">Email</Typography>
        <TextField
          id="email"
          variant="standard"
          value="jbridges1119@gmail.com"
          // onChange={(e) => {
          //   setEmail(e.target.value);
          // }}
        />
        <Typography variant="body1">Password</Typography>
        <TextField
          id="outlined-password-input"
    
          autoComplete="current-password"
          type="password"
          variant="standard"
          value="qqqqqqq"
          // onChange={(e) => {
          //   setPassword(e.target.value);
          // }}
        />

        <Button variant="contained" onClick={login}>
          Login
        </Button>
        <Typography variant="h6">{loginStatus}</Typography>
      </Stack>
    </div>
  )
}

export default Login