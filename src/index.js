/**
 * This skill is based on the nodejs skill development kit and 
 * supports the SpeakUp skill.
 **/

'use strict';

const Alexa = require('alexa-sdk');

// this is the card that displays on
const imageObj = {
    smallImageUrl: 'https://s3.amazonaws.com/camerongallagherfoundation/images/small.png',
    largeImageUrl: 'https://s3.amazonaws.com/camerongallagherfoundation/images/large.png'
};

// this is the endpoint for where the media is located for the skill
const mediaLocation = "https://s3.amazonaws.com/camerongallagherfoundation/";

// this is the array of individual quote files stored in S3
const quotes = [
    "Alexa_Gray_Babe+Ruth.mp3",
    "Alexa_Gray_Buddha.mp3",
    "Alexa_Gray_Covey.mp3",
    "Alexa_Gray_Dalai+Lama.mp3",
    "Alexa_Gray_Eisenhower.mp3",
    "Alexa_Gray_Ford.mp3",
    "Alexa_Gray_Kimbro.mp3",
    "Alexa_Gray_Meyer.mp3",
    "Alexa_Gray_Roosevelt.mp3",
    "Alexa_Gray_Thoreau.mp3",
    "Alexa_Reed_Angelou.mp3",
    "Alexa_Reed_Bradstreet.mp3",
    "Alexa_Reed_Churchill.mp3",
    "Alexa_Reed_Dumbledore.mp3",
    "Alexa_Reed_Eggers.mp3",
    "Alexa_Reed_Emerson.mp3",
    "Alexa_Reed_Franklin.mp3",
    "Alexa_Reed_Goodman.mp3",
    "Alexa_Reed_Nelson.mp3",
    "Alexa_Reed_Poindexter.mp3",
    "Alexa_Reed_Swift.mp3",
    "Alexa_Reed_Tolstoy.mp3",
    "Alexa_Reed_Twain.mp3",
];

// this is the array of individual mindful moments files stored in S3
const mindfulMoments = [
    "Alexa_Reed_MindfulMoment_Breathing.mp3",
    "Alexa_Reed_Mindfulmoment_Smile.mp3"
];

// this is the array of upcoming events that will be read back to the user
const eventCalendar = [
    { "eventName":"Richmond Speak Up 5k", "eventDate":"September 9th, 2017" },
    { "eventName":"Speak Up Light Up Party", "eventDate":"January 27th, 2018" }
];

const APP_ID = undefined;
//[ToDo: adding AppId is throwing an exception]
//const APP_ID = 'amzn1.ask.skill.99b7b771-7458-4157-9a5b-76d5372e3cae';
                
const handlers = {
    'LaunchRequest': function () {
        var quoteSelection = Math.floor(Math.random() * quotes.length);
        // this is the mp3 that will be played
        var quoteFile = quotes[quoteSelection];
        console.log("quote selection played: " + quoteFile);

        // make valid SSML syntax for playing MP3
        var message = "<audio src=\"" + mediaLocation + "quotes/" + quoteFile + "\"/>";
        // add a one second break
            message = message + "<break time=\"1s\"/>";
            message = message + "You can also ask Speak Up for a minute of mindfulness, upcoming " +
                "events, or play Camerons song.";
        var repeat = "If you would like to hear another quote, say read me a quote. ";

        this.emit(':askWithCard', message, repeat, imageObj);
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
        // generate a random number to select the mindful moments clip
        var msgSelection = Math.floor(Math.random() * mindfulMoments.length);

        // make valid SSML syntax for playing MP3
        var message = "<audio src=\"" + mediaLocation + "mindfulMoments/" + 
            mindfulMoments[msgSelection] + "\"/>";
        // add some closing language to be played after the music.
            message = message + "<break time=\"1s\"/>";
            message = message + "You can also ask Speak Up for a quote, upcoming " +
                "events, or play Camerons song.";            
        var repeat = "Please say something like, read me a quote to get started. ";

        this.emit(':askWithCard', message, repeat, imageObj);
    },
    'GetUpcomingEvents': function() {
        var message = "Here are the upcoming events. ";
        // go through array and list out events - have a one second break between each
        for (var i = 0; i < eventCalendar.length; i++) {
            message = message + "<break time=\"1s\"/>";
            message = message + eventCalendar[i].eventName + " on " + eventCalendar[i].eventDate + ". ";
        }
        // close message with reference to the website
        message = message + "<break time=\"1s\"/>";
        message = message + "For more details, please visit our website at ";
        message = message + "<break time=\"0.5s\"/>";
        message = message + "ckg foundation dot org.";
        
        this.emit(':tell',message);
    },
    'AMAZON.HelpIntent': function () {
        var message = "This skill is called Speak Up, and can do a variety of things. " +
            "You can say, give me a quote and I will read an inspirational quote. " +
            "You can say, play cameron song and I will play a song that is a tribute to Cameron Gallagher. " +
            "You can say, give me a minute of mindfulness and I will help you relax. " +
            "or you can say what are upcoming events, and I will list you what events the foundation has on the calendar. ";
        var repeat = "Please say something like, read me a quote to get started. ";
        this.emit(':ask', message, repeat);
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
