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

// utility methods for creating Image and TextField objects
const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeImage     = Alexa.utils.ImageUtils.makeImage;

// this is a public endpoint for the background image
const backgroundImage = "https://s3.amazonaws.com/camerongallagherfoundation/images/background.png";

// this is the error message given if someone attempts to play a video without an Alexa
const nonVideoMessage = "Sorry, this plays a video which requires an Echo Show or Spot.";

// this is the endpoint for where the media is located for the skill
const mediaLocation = "https://s3.amazonaws.com/camerongallagherfoundation/";

// this is the array of individual quote files stored in S3
const quotes = require("data/quotes.json");

// this is the array of individual mindful moments files stored in S3
const mindfulMoments = require("data/mindful.json");

// this is the array of upcoming events that will be read back to the user
const eventCalendar = [
    { "eventName":"Richmond Speak Up 5k", "eventDate":"September 9th, 2017" },
    { "eventName":"Speak Up Light Up Party", "eventDate":"January 27th, 2018" }
];

// this is the app id from Alexa
const APP_ID = 'amzn1.ask.skill.99b7b771-7458-4157-9a5b-76d5372e3cae';
                
const handlers = {
    'LaunchRequest': function () {
        const quoteSelection = Math.floor(Math.random() * quotes.length);
        // this is the mp3 that will be played
        const quoteFile = quotes[quoteSelection];
        console.log("quote selection played: " + quoteFile);

        // make valid SSML syntax for playing MP3
        var message = "<audio src=\"" + mediaLocation + "quotes/" + quoteFile + "\"/>";
        // add a one second break
            message = message + "<break time=\"1s\"/>";
            message = message + "You can also ask Speak Up for a minute of mindfulness, " +
                "play Camerons song, or learn about the foundation by saying 'learn more'.";
        var repeat = "If you would like to hear another quote, say read me a quote. ";

        // check if the device has a video screen - if so - build the background template
        if (this.event.context.System.device.supportedInterfaces.Display){
            const builder = new Alexa.templateBuilders.BodyTemplate1Builder();
            const template = builder.setTitle('Your Personal Coach')
                .setBackgroundImage(makeImage(backgroundImage))
                .setTextContent(makePlainText('Speak Up'))
                .build();
            this.response.speak(message).listen(repeat).renderTemplate(template);
            this.emit(':responseReady');
        } else {
            this.emit(':askWithCard', message, repeat, imageObj);
	}
    },
    'PlayCameronSong': function() {
	// if the device is an Echo Show, play the video - else play the song
        if (this.event.context.System.device.supportedInterfaces.VideoApp) {
            const videoObject = 'Cameron_song_video.mp4';
            const videoTitle = "Cameron's Song";
            const videoClip = mediaLocation + "videos/" + videoObject;
            // this will be rendered when the user selects video controls
            const metadata = {
                'title': videoTitle
            };
            console.log("play video:" + videoClip);
            this.response.playVideo(videoClip, metadata);
            this.emit(':responseReady');
	} else {
            // this is the mp3 file name for Cameron's song
            var songFile = "Cameron.mp3";

            // make valid SSML syntax for playing MP3
            var message = "<audio src=\"" + mediaLocation + songFile + "\"/>";
            // add a one second break
                message = message + "<break time=\"1s\"/>";
                message = message + "The full version of Cameron's song by Christopher Minton " +
                    "is available on iTunes.";

            this.emit(':tellWithCard', message, imageObj);
	}
    },
    // this plays the mindfulness audio or video clip
    'GetMinuteMindfulness': function() {
        // generate a random number to select the mindful moments clip
        const msgSelection = Math.floor(Math.random() * mindfulMoments.length);
	const slots = this.event.request.intent.slots;

	console.log("Playing Minute of Mindfulness");

	// check if the device is an echo show or something with a screen
        if (this.event.context.System.device.supportedInterfaces.VideoApp) {
	    // if a video number has been provided, play that video, else give list
	    if (slots.VideoNumber.value) {
		this.emit('PlayMindfulVideo');
	    } else {
		this.emit('ListMindfulVideos');
	    }
        } else {
            // make valid SSML syntax for playing MP3
            var message = "<audio src=\"" + mediaLocation + "mindfulMoments/" + 
                mindfulMoments[msgSelection].audio + "\"/>";
            // add some closing language to be played after the music.
                message = message + "<break time=\"1s\"/>";
                message = message + "You can also ask Speak Up for a quote, upcoming " +
                	"events, or play Camerons song.";            
            var repeat = "Please say something like, read me a quote to get started. ";

            this.emit(':askWithCard', message, repeat, imageObj);
	}
    },
    'ElementSelected': function() {
	console.log("Mindful Video Selected from Device Screen " + this.event.request.token);

        var videoName = "";
        // match token to song name and find the video object to play
        for (var i = 0; i < mindfulMoments.length; i++ ) {
            if (mindfulMoments[i].token === this.event.request.token) {
                console.log("Play " + mindfulMoments[i].title);
                videoName = mindfulMoments[i].videoObject;
            }
        }

        const videoTitle = 'Mindful Moments';
        const videoClip = mediaLocation + "videos/" + videoName;

        // this will be rendered when the user selects video controls
        const metadata = {
            'title': videoTitle
        };

        console.log("play video:" + videoClip);

        this.response.playVideo(videoClip, metadata);
        this.emit(':responseReady');
    },
    'PlayMindfulVideo': function() {
	const videoNumber = Number(this.event.request.intent.slots.VideoNumber.value);
	// make sure a bad number is not selected
	if (videoNumber > 10) {
	    videoNumber = 1
	}
        console.log("Playing Mindful Video " + videoNumber);

	const videoObject = mindfulMoments[videoNumber].video;
	const videoTitle = 'Mindful Moments';
	const videoClip = mediaLocation + "videos/" + videoObject;
            
	// this will be rendered when the user selects video controls
	const metadata = {
	    'title': videoTitle
	};
            
	console.log("play video:" + videoClip);
            
	this.response.playVideo(videoClip, metadata);
	this.emit(':responseReady');
    },
    'ListMindfulVideos': function() {
	console.log("List Videos");

	const itemImage = null;
	const listItemBuilder 	  = new Alexa.templateBuilders.ListItemBuilder();
	const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate1Builder();

	var message = "There are ten different videos currently available. ";
	const listRepeat = "If you would like to see a mindful moments video, say something like Play Video Three. ";	    

	// build list of all available songs
	for (var i = 0; i < mindfulMoments.length; i++ ) {
	    // pull attributes from mindful moments array and apply to the list
	    listItemBuilder.addItem(null, mindfulMoments[i].token, makePlainText(mindfulMoments[i].title));
	}
	    
	message = message + "Just select on the screen a video, or request by saying something " +
	    "like, Play mindful video three.";

	const listItems = listItemBuilder.build();
	const listTemplate = listTemplateBuilder.setToken('listToken')
						.setTitle('Available Video List')
						.setListItems(listItems)
						.setBackgroundImage(makeImage(backgroundImage))
						.build();
	   	
	console.log(JSON.stringify(listTemplate));
	this.response.speak(message).listen(listRepeat).renderTemplate(listTemplate);
	this.emit(':responseReady');
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
            "or you can say 'learn more', and I will share more details about the foundations background. ";
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
    'PlayVideo': function() {
        console.log("play video requested" + JSON.stringify(this.event));
        if (this.event.context.System.device.supportedInterfaces.VideoApp) {
            const videoObject = 'about_ckg_video.mp4';
	    const videoTitle = 'About CKG Foundation';
            const videoClip = mediaLocation + "videos/" + videoObject;
            // this will be rendered when the user selects video controls
            const metadata = { 
                'title': videoTitle
            };
	    console.log("play video:" + videoClip);
            this.response.playVideo(videoClip, metadata);
	    this.emit(':responseReady');
        } else {
            // this is the mp3 file name for the about ckg video
            const songFile = "audio/about_ckg_audio.mp3";

            // make valid SSML syntax for playing MP3
            const message = "<audio src=\"" + mediaLocation + songFile + "\"/>";

            this.emit(':tellWithCard', message, imageObj);
        }
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
