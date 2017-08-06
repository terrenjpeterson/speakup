/**
 * This skill is based on the nodejs skill development kit and 
 * supports the SpeakUp skill.
 **/

'use strict';

const Alexa = require('alexa-sdk');

// this is the card that displays on
var imageObj = {
    smallImageUrl: 'https://s3.amazonaws.com/camerongallagherfoundation/images/small.png',
    largeImageUrl: 'https://s3.amazonaws.com/camerongallagherfoundation/images/large.png'
};

// this is the endpoint for where the media is located for the skill
const mediaLocation = "https://s3.amazonaws.com/camerongallagherfoundation/";

// this is the array of individual quote files stored in S3
var quotes = [
    "FightFinishFaith.mp3",
    "SmoothSailor.mp3"
];

const APP_ID = undefined;
//[ToDo: adding AppId is throwing an exception]
//const APP_ID = 'amzn1.ask.skill.99b7b771-7458-4157-9a5b-76d5372e3cae';
                
const handlers = {
    'LaunchRequest': function () {
        var quoteSelection = Math.floor(Math.random() * quotes.length);
        // this is the mp3 that will be played
        var quoteFile = quotes[quoteSelection];

        // make valid SSML syntax for playing MP3
        var message = "<audio src=\"" + mediaLocation + "quotes/" + quoteFile + "\"/>";
        // add a one second break
            message = message + "<break time=\"1s\"/>";
            message = message + "You can also ask Speak Up for a minute of mindfulness, upcoming " +
                "events, or play Camerons song.";

        this.emit(':tellWithCard', message, imageObj);
    },
    'PlayCameronSong': function() {
        // this is the mp3 file name for Cameron's song
        var songFile = "Cameron.mp3";

        // make valid SSML syntax for playing MP3
        var message = "<audio src=\"" + mediaLocation + songFile + "\"/>";
        // add a one second break
            message = message + "<break time=\"1s\"/>";
            message = message + "The full version of Cameron's song by Christopher Minton " +
                "is available on iTunes.";

        this.emit(':tellWithCard', message, imageObj);
    },
    'GetMinuteMindfulness': function() {
        // this is the mp3 for Mindfullness music
        var songLocation = "https://s3.amazonaws.com/time-out-alexa-skill-audio/";
        var songFile = "1minute.mp3";

        var message = "Give yourself permission to allow this moment to be exactly as it is.";
            message = message + "<break time=\"0.5s\"/>";
            message = message + "and allow yourself to be exactly as you are";
            message = message + "<break time=\"0.2s\"/>";
        // make valid SSML syntax for playing MP3
        var songMarkup = "<audio src=\"" + songLocation + songFile + "\"/>";
            message = message + songMarkup;
        // add some closing language to be played after the music.
            message = message + "<break time=\"0.2s\"/>";
            message = message + "Becoming fully aware of your body, breath and immediate " +
                "environment brings you into the present moment";
            message = message + "<break time=\"0.5s\"/>";
            message = message + "helping you see the true nature of things more clearly.";
            message = message + "<break time=\"0.5s\"/>";
            message = message + "The more you practice such simple mindfulness exercises";
            message = message + "<break time=\"0.5s\"/>";
            message = message + "the calmer your disposition will become in everyday life.";            

        this.emit(':tellWithCard', message, imageObj);
    },
    'GetUpcomingEvents': function() {
        var message = "Get upcoming events.";
        this.emit(':tell',message);
    },
    'AMAZON.HelpIntent': function () {
        var message = "Here is how to use this skill.";
        this.emit(':tell', message);
    },
    'AMAZON.CancelIntent': function () {
        var message = "Thanks for using the skill";
        this.emit(':tell', message);
    },
    'AMAZON.StopIntent': function () {
        var message = "Thanks for using the skill";
        this.emit(':tell', message);
    },
    'SessionEndedRequest': function () {
        var message = "Thanks for using the skill";
        this.emit(':tell', message);
    },
    'Unhandled': function() {
        console.log("UNHANDLED");
        var message = "I'm sorry, I didn't understand your request. Please try again.";
        this.emit(':tell', message);
    }    
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
