const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const moment= require('moment'); 
const { resolve } = require('path');
 
const {OAuth2} = google.auth
require('dotenv').config();

const oAuth2Client = new OAuth2(process.env.USER_CREDENTIAL, process.env.USER_SECRET)

oAuth2Client.setCredentials({refresh_token: process.env.USER_REFRESH_TOKEN,})

const calendar = google.calendar({version: 'v3', auth: oAuth2Client})

exports.addAttende_in_calendar = function(req){
  return new Promise( (resolve) => {
    calendar.events.get(
      {
        calendarId: 'primary', 
        eventId: req.calendarEventId,
      }, (err, event) => {
        if(err) return console.error('Error Addattende get calendar: ', err);
        console.log("evento:   " , event)
        var attendees = event.data.attendees;
        
        attendees.push({email: req.email});

        var resource = { attendees: attendees };
      
        return calendar.events.patch(
        {
          resource: resource, 
          calendarId: 'primary', 
          eventId: req.calendarEventId,
          sendUpdates: "all"
        }, (err, response) => {
          if(err) resolve(console.error('Calendar Event Patch Error: ', err))
          resolve(response)
        })
        
      })
  })
}
exports.updateRoom_in_calendar = function(req){
  return new Promise( (resolve) => {
    var eventEndTime = moment(req.date).add(req.duration, 'm').toDate();
    const event = {
      summary: req.name,
      location: 'We Study Platform',
      description: req.description,
      start: {
        dateTime: req.date, 
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: eventEndTime, 
        timeZone: 'America/Bogota',
      },
      colorId: 3,
      conferenceData: {
        createRequest: {
            conferenceSolutionKey: {
                type: "hangoutsMeet"
            },
            "requestId": "Study room - We Study",
        },
      },
      attendees: [ { email: req.ownerEmail} ],
    }
    return calendar.events.update(
      { 
        calendarId: 'primary', 
        eventId: req.calendarEventId,
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: "all"
      }, 
      (err, event) => {
        if(err) resolve(console.error('Calendar Event Creation Error: ', err))
  
        console.log('Event uploaded');
        resolve(event)
      })
  })
}
exports.deleteRoom_in_calendar = function(eventId){
  return new Promise( (resolve, next) => {
    return calendar.events.delete(
      { 
        calendarId: 'primary', 
        sendUpdates: "all",
        eventId: eventId,
      }, 
      (err, event) => {
        if(err) {
          err = new Error('Error deleting ' + eventId + ' Calendar event' );
          err.status = 404;
          return next(err);
        }
  
        console.log('log Calendar deleted');
        resolve('Calendar deleted')
      })
  })
}
exports.insertRoom_in_calendar = function(req){
  return new Promise( (resolve) => {
    var eventEndTime = moment(req.date).add(req.duration, 'm').toDate();
    const event = {
      summary: req.name,
      location: 'We Study Platform',
      description: req.description,
      start: {
        dateTime: req.date, 
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: eventEndTime, 
        timeZone: 'America/Bogota',
      },
      colorId: 3,
      conferenceData: {
        createRequest: {
            conferenceSolutionKey: {
                type: "hangoutsMeet"
            },
            "requestId": "Study room - We Study",
        },
      },
      attendees: [ { email: req.ownerEmail} ],
    }
      
    
    return calendar.events.insert(
    { 
      calendarId: 'primary', 
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all"
    }, 
    (err, event) => {
      if(err) return console.error('Calendar Event Creation Error: ', err)

      console.log('Event created: %s', event.data.hangoutLink);
      resolve(event)
    })
      
  })
}
    


