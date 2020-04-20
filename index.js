const express = require('express')
const bodyParser= require('body-parser')
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const port = process.env.PORT || 3000;

var config = require("./oauth.js");

const app = express()

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

//google-strategy
passport.use(
    new GoogleStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL
      },
      (accessToken, refreshToken, profile, done) => {          
          
          done(null, refreshToken);

    }
  )
)

app.use(bodyParser.urlencoded({extended: true}))
app.use(passport.initialize());

const routes = require("./routes");
app.use("/", routes);

app.listen(port, () => console.log(`App is up and running on port ${port}.`));
