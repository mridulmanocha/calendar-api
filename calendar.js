const { google } = require('googleapis')
const { OAuth2 } = google.auth

var config = require("./oauth.js");

exports.create_event = (req, res) => {

const oAuth2Client = new OAuth2(
            config.clientID,
            config.clientSecret
)

oAuth2Client.setCredentials({
refresh_token: req.app.get('token'),
})

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay() + 2)

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDay() + 4)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

// Create a dummy event for temp uses in our calendar
const event = {
summary: req.body.title,
description: req.body.body,
colorId: 1,
start: {
dateTime: eventStartTime,
timeZone: 'Asia/Kolkata',
},
end: {
dateTime: eventEndTime,
timeZone: 'Asia/Kolkata',
},
}

// Check if we a busy and have an event on our calendar for the same time.
calendar.freebusy.query(
{
  resource: {
    timeMin: eventStartTime,
    timeMax: eventEndTime,
    timeZone: 'Asia/Kolkata',
    items: [{ id: 'primary' }],
  },
},
(err, res) => {
  // Check for errors in our query and log them if they exist.
  if (err) return console.error('Free Busy Query Error: ', err)

  // Create an array of all events on our calendar during that time.
  const eventArr = res.data.calendars.primary.busy

  // Check if event array is empty which means we are not busy
  if (eventArr.length === 0)
    // If we are not busy create a new calendar event.
    return calendar.events.insert(
      { calendarId: 'primary', resource: event },
      err => {
        // Check for errors and log them if they exist.
        if (err) return console.error('Error Creating Calender Event:', err)
        // Else log that the event was created.
        return console.log('Calendar event successfully created.')
      }
    )

  // If event array is not empty log that we are busy.
  return console.log(`Sorry I'm busy...`)
 }
)
          
calendar.events.list({
calendarId: 'primary',
timeMin: (new Date()).toISOString(),
maxResults: 10,
singleEvents: true,
orderBy: 'startTime',
}, 	
  (err, resp) => {
	res.json(resp.data)
});

};

