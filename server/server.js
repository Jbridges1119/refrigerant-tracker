require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const methodOverride = require("method-override");
const morgan = require("morgan");
const app = express();
const session = require('express-session')
app.use(express.json());
//MIDDLEWARE
//Morgan - console.logs server connection info on request
//CookieSession - encrypted cookie
app.use(cors());
app.use(morgan("common"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: parseInt(process.env.LIFETIME)
  }
}))


// ROUTES

const usersRoutes = require("./routes/users");
const companiesRoutes = require("./routes/companies");

app.use("/users", usersRoutes(db));
app.use("/companies", companiesRoutes(db));

//SERVER CONNECTION
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server is running and listening to port ${port}`);
});
