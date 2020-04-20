const express = require('express')
const router = express.Router();
const passport = require("passport");

var calendar = require("./calendar.js");

//home-page
router.get('/',function(req,res){
  res.sendFile(__dirname + '/views/index.html'); 
});

//event-page
router.get('/event',function(req,res){
  res.sendFile(__dirname + '/views/event.html');
});

//create-event
router.post('/create-event',
  calendar.create_event
)

//google-login-initiate
router.get(
  "/google/start",
  passport.authenticate("google", {
            accessType: 'offline',
            prompt: 'consent',
            session: false,
            scope:  ["profile","email","https://www.googleapis.com/auth/calendar.events",
                     "https://www.googleapis.com/auth/calendar"]
        })
);

//google-callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
      req.app.set('token', req.user)
    return res.redirect("/event")
});

module.exports = router;
