require("dotenv").config();
const express = require("express");
const cors = require("cors");//Prevents Cors error
const db = require("./db");//DataBase Connection
const methodOverride = require("method-override");//Allows for delete & put 
// const bodyParser = require('body-parser');//Comes with express now
const cookieParser = require("cookie-parser");//Parse our cookies
const morgan = require("morgan");
const app = express();
const session = require('express-session');//Creating cookie sessions
const jwt = require('jsonwebtoken');
app.use(express.json());

//MIDDLEWARE

app.use(cors({
  origin: ["http://localhost:3000"],//our client location -- update when hosting
  methods: ["GET", "POST"],
  credentials: true //Without this you can have an error
}));
app.use(morgan("common"));
app.use(methodOverride("_method"));
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));//Shouldn't need it 
app.use(express.urlencoded({ extended: true }));
app.use(session({
  key: "userID",
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    expires: 60 * 60 * 24 *  1000
    // maxAge: parseInt(process.env.LIFETIME)
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
