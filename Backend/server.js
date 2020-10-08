const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportlocal = require("passport-local").Strategy;
const cookieparser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const User = require("./user");
const app = express();
const port = process.env.PORT || 3001;

//connect to mongo
mongoose.connect(
  "mongodb+srv://Eli:INGdDeviiUyH1uJY@cluster0.lkc5n.mongodb.net/testAuth?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log("connected to mongoose");
  }
);

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: json }));
app.use(
  cors({
    origin: "http://localhost:3000", //for connection to the react app
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieparser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

//ROUTES
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    //using local strategy
    if (err) throw err;
    if (!user) res.status(404).send("no user exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
      });
    }
  })(req, res, next);
});

app.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User already Exists");
    if (!doc) {
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        password: hashedPass,
      });

      await newUser.save();
      res.status(201).send("New User Created");
    }
  });
});

app.get("/user", (req, res) => {
  res.send(req.user); //current user
});

//start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//Once AUthenticated,
//the user is stored int he req.user,
// the req object you get from the client
//now has a user object inside of it andcontains all of the session data
//this can be used nad called at any time anywhere inthe app
