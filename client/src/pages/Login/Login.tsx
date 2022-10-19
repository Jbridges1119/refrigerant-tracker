import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePageLocation } from "../../context/sharedContext";

// type props = {
//   setLoggedIn: (loggedIn: boolean) => void;
// };

const Login: React.FC = () => {
  const {loggedIn, setLoggedIn, setUserInfo, setUserData} = usePageLocation();
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
        if (!data.data.auth) {
          setLoginStatus(data.data.error);
          console.log(data.data.error);
          setLoggedIn(false);
        } else {
          setLoginStatus("");
          console.log(data);
          setLoggedIn(true);
          setUserInfo(data.data.users)
          setUserData(data.data.userInfo)
          
        }
      });
  };

  const InputBox = styled(Box)`
    width: 90%;
  `;

  const outerBox = {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    background: "#F5F7FF",
  };

  const cardSX = {
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    height: "500px",
    width: "100%",
    my: 10,
    mx: 2,
    borderRadius: 10,
  };

  return (
    <Box sx={outerBox}>
      <Typography variant="h1" fontWeight={"bold"} textAlign={"center"} mt={3}>FreonTrak</Typography>
      <Card sx={cardSX}>
        <Typography variant="h3">Sign In</Typography>
        <Typography variant="h6">Pre-Filled Test Account</Typography>
        <InputBox>
          <Typography variant="body1" fontWeight={"bold"}>
            Email
          </Typography>
          <TextField
            sx={{ width: "100%" }}
            id="email"
            variant="standard"
            value="jbridges1119@gmail.com"
            //Commented out for test account login
            // onChange={(e) => {
            //   setEmail(e.target.value);
            // }}
          />
        </InputBox>
        <InputBox>
          <Typography variant="body1" fontWeight={"bold"}>
            Password
          </Typography>
          <TextField
            sx={{ width: "100%" }}
            id="outlined-password-input"
            autoComplete="current-password"
            type="password"
            variant="standard"
            value="qqqqqqqq"
            //Commented out for test account login
            // onChange={(e) => {
            //   setPassword(e.target.value);
            // }}
          />
        </InputBox>
        <Button variant="contained" onClick={login}>
          Login
        </Button>
        <Typography variant="body2" width={"90%"}>
          By signing in, you agree to the FreonTrak <Link to="/Terms">Terms of Service</Link> and <Link to="/Privacy">Privacy Policy</Link>.
        </Typography>
        <Typography variant="h6">{loginStatus}</Typography>
      </Card>
    </Box>
  );
};

export default Login;
