/**
 * This skill is based on the nodejs skill development kit and 
 * supports the SpeakUp skill.
 **/

'use strict';

const Alexa = require('alexa-sdk');

// this is the card that displays on the companion device paired with the Alexa
const imageObj = {
    smallImageUrl: 'https://s3.amazonaws.com/camerongallagherfoundation/images/small.png',
    largeImageUrl: 'https://s3.amazonaws.com/camerongallagherfoundation/images/large.png'
};

// utility methods for creating Image and TextField objects
const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeImage     = Alexa.utils.ImageUtils.makeImage;

// this is a public endpoint for the background image
const backgroundImage = "https://s3.amazonaws.com/camerongallagherfoundation/images/background.png";
const darkBackground  = "https://s3.amazonaws.com/camerongallagherfoundation/images/darkBackground.png";

// this is the error message given if someone attempts to play a video without an Alexa
const nonVideoMessage = "Sorry, this plays a video which requires an Echo Show or Spot.";

// this is the endpoint for where the media is located for the skill
const mediaLocation = "https://s3.amazonaws.com/camerongallagherfoundation/";

// this is the array of individual quote files stored in the build package
const quotes = require("data/quotes.json");

// this is the array of individual mindful moments files stored in the build package
const mindfulMoments = require("data/mindful.json");

// this is the app id from Alexa
const APP_ID = 'amzn1.ask.skill.99b7b771-7458-4157-9a5b-76d5372e3cae';

// this is the identifier for the full length version of the song
const full_length_prod = 'amzn1.adg.product.f88555b5-10ae-419a-8923-b5061cb380d8';

// this is needed for invoking the in-skill purchase API
const https = require('https');
                
const handlers = {
    // this gets invoked when a new session is created. this will be driven by user requests or purchase events
    'NewSession': function() {
        console.log("New Session.");

        if (this.event.request.type === 'LaunchRequest') {
            var message = "1 out of every 4 teenagers suffers from mental illness, but everyone has mental health. " +
		"The Cameron K. Gallagher Foundation offers free mental health programs to teenagers. You can ask " +
		"Alexa for a moment of mindfulness, or play Cameron's Song. ";

	    // note that in-skill purcchase only works in the US
	    if (this.event.request.locale === 'en-US') {

	        var returnData = [];

	        // Information required to invoke the API is available in the session
	        const apiEndpoint = "api.amazonalexa.com";
	        const token  = "bearer " + this.event.context.System.apiAccessToken;
	        const language    = this.event.request.locale;

	        // The path for the in skill products API
	        const apiPath     = "/v1/users/~current/skills/~current/inSkillProducts";

	        const options = {
	            host: apiEndpoint,
	            path: apiPath,
	            method: 'GET',
	            headers: {
	                "Content-Type"      : 'application/json',
	                "Accept-Language"   : language,
	                "Authorization"     : token
	            }
	        };

	        console.log('ISP API:' + JSON.stringify(options));

	        // Call the API to see if the extended version has already been purchased for this user
	        const req = https.get(options, (res) => {
	            res.setEncoding("utf8");
	
	            res.on('data', (chunk) => {
	                console.log("Chunk:" + chunk);
	                returnData += chunk;
	            });

	            req.on('error', (e) => {
	                console.log('Error calling InSkillProducts API: ' + e.message);
	                const message = 'Hmmm - something went wrong.  Please try again later.';
	                this.emit(':ask', message, message);
	            });

	            res.on('end', () => {
	                var userEntitlement = eval('(' + returnData + ')');
	                console.log("Finished. API Code:" + res.statusCode);

	                // vary response based on if the user has already purchased the full version of the song
	                if (userEntitlement.inSkillProducts[0].entitled === 'NOT_ENTITLED') {
			    message = message + "Just say, Purchase the Full Song, to contribute to CKG's mission.";
			}
		    });
		});
	    }

            const repeat = "Please say something like, play Cameron's Song. ";

            this.emit(':askWithCard', message, repeat, imageObj);

        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'PlayCameronSong') {
            this.emit('PlayCameronSong');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'GetMinuteMindfulness') {
            this.emit('GetMinuteMindfulness');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'BuyFullVersion') {
            this.emit('BuyFullVersion');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'PlayVideo') {
            this.emit('PlayVideo');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'ProductInfo') {
            this.emit('ProductInfo');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'RefundFullVersion') {
            this.emit('RefundFullVersion');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'LaunchRequest') {
            this.emit('PlayMindfulMoment');
	} else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.PauseIntent') {
	    this.emit('AudioControls');
	} else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.CancelIntent') {
	    this.emit('AudioControls');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.LoopOffIntent') {
            this.emit('AudioControls');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.LoopOnIntent') {
            this.emit('AudioControls');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.NextIntent') {
            this.emit('AudioControls');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.PauseIntent') {
            this.emit('AudioControls');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.PreviousIntent') {
            this.emit('AudioControls');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.RepeatIntent') {
            this.emit('AudioControls');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.ShuffleOffIntent') {
            this.emit('AudioControls');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.ShuffleOnIntent') {
            this.emit('AudioControls');
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.StartOverIntent') {
            this.emit('AudioControls'); 
        } else if (this.event.request.type === 'IntentRequest' && this.event.request.intent.name === 'AMAZON.ResumeIntent') {
            this.emit('AudioControls');
        } else {
            // these are events generated from the purchase engine
            console.log('Request received from purchase engine.');
            this.emit('ProcessPurchaseEvent');
        } 
    },
    'PlayCameronSong': function() {
        console.log('request made to provide information about premium version of skill');

        var returnData = [];

        // Information required to invoke the API is available in the session
        const apiEndpoint = "api.amazonalexa.com";
        const token  = "bearer " + this.event.context.System.apiAccessToken;
        const language    = this.event.request.locale;

        // The path for the in skill products API
        const apiPath     = "/v1/users/~current/skills/~current/inSkillProducts";

        const options = {
            host: apiEndpoint,
            path: apiPath,
            method: 'GET',
            headers: {
                "Content-Type"      : 'application/json',
                "Accept-Language"   : language,
                "Authorization"     : token
            }
        };

        console.log('ISP API:' + JSON.stringify(options));

        // Call the API to see if the extended version has already been purchased for this user
        const req = https.get(options, (res) => {
            res.setEncoding("utf8");

            res.on('data', (chunk) => {
                console.log("Chunk:" + chunk);
                returnData += chunk;
            });

            req.on('error', (e) => {
                console.log('Error calling InSkillProducts API: ' + e.message);
                const message = 'Hmmm - something went wrong.  Please try again later.';
                this.emit(':ask', message, message);
            });

            res.on('end', () => {
                var userEntitlement = eval('(' + returnData + ')');
                console.log("Finished. API Code:" + res.statusCode);

                // vary response based on if the user has already purchased the full version of the song
                if (userEntitlement.inSkillProducts[0].entitled === 'ENTITLED') {
                    if (this.event.context.System.device.supportedInterfaces.VideoApp) {
                        const videoObject = 'CKG_Alexa_Skill_Camerons_Song.mp4';
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
			console.log("Playing Full Version of Song");
			// Add directive to play mp3 file for Cameron's Song
			const urlAudioFile = "https://s3.amazonaws.com/camerongallagherfoundation/audio/CameronsSongFull.mp3";
			this.response._addDirective(buildAudioPlayDirective(urlAudioFile, 0));

		        const message = "Thanks for purchasing Cameron's song by Christopher Minton. ";
		        this.response.speak(message);
			this.emit(':responseReady');
        		console.log(JSON.stringify(this.response));
		    }
                } else {
		    // this is the flow if the full song has not been purchased
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
			console.log("Playing Short Version of Song");
            		// this is the mp3 file name for Cameron's song
            		var songFile = "Cameron.mp3";

            		// make valid SSML syntax for playing MP3
			var message = "Here is a sample of Cameron's Song by Christopher Minton. " +
            		    "<audio src=\"" + mediaLocation + songFile + "\"/>" + "<break time=\"1s\"/>";
			var repeat = "If you would like to hear again, please say, Play Cameron's Song.";

			// if in the US - attempt to upsell for the full version of the song
			if (this.event.request.locale === 'en-US') {
                	    message = message + "The full version of Cameron's song by Christopher Minton " +
                    		"is available on this skill, and can be purchased by saying " +
                    		"Purchase full song. The proceeds help fund our mental health programs for " +
				"teens.";
            		    repeat = "If you would like to purchase the full version of the song, " +
                	        "please say, Purchase Full Song.";
			}

			console.log("Message:" + message);
            		this.emit(':askWithCard', message, repeat, imageObj);
        	    }
                }
            });
        });
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
                message = message + "You can also ask Speak Up for a quote or play Camerons song.";            
            var repeat = "Please say something like, read me a quote to get started. ";

            this.emit(':askWithCard', message, repeat, imageObj);
	}
    },
    // this plays a quote
    'PlayQuote': function() {
	console.log("Quote Requested");

        const quoteSelection = Math.floor(Math.random() * quotes.length);
        // this is the mp3 that will be played
        const quoteFile = quotes[quoteSelection];
        console.log("quote selection played: " + quoteFile);

        // make valid SSML syntax for playing MP3
        var message = "<audio src=\"" + mediaLocation + "quotes/" + quoteFile + "\"/>";
        // add a one second break
            message = message + "<break time=\"1s\"/>";
            message = message + "You can also ask Speak Up for a minute of mindfulness, " +
                "learn more about the foundation, or play Camerons song.";
        const repeat = "If you would like to hear another quote, say read me a quote. ";

        this.emit(':askWithCard', message, repeat, imageObj);
    },
    // this is the event triggered by touching the device screen
    'ElementSelected': function() {
	console.log("Mindful Video Selected from Device Screen " + this.event.request.token);

        var videoName = "";
        // match token to song name and find the video object to play
        for (var i = 0; i < mindfulMoments.length; i++ ) {
            if (mindfulMoments[i].token === this.event.request.token) {
                console.log("Play " + mindfulMoments[i].title);
                videoName = mindfulMoments[i].video;
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
    // this plays a mindful moments video based on the custom slot uttered by the user
    'PlayMindfulVideo': function() {
	const videoNumber = Number(this.event.request.intent.slots.VideoNumber.value);
	// make sure a bad number is not selected
	if (videoNumber > 10) {
	    videoNumber = 1
	}
        console.log("Playing Mindful Video " + videoNumber);

	const videoObject = mindfulMoments[videoNumber - 1].video;
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
    // this provides a complete list of mindful moment videos
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
						.setBackgroundImage(makeImage(darkBackground))
						.build();
	   	
	console.log(JSON.stringify(listTemplate));
	this.response.speak(message).listen(listRepeat).renderTemplate(listTemplate);
	this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        var message = "This skill is called Speak Up, and can do a variety of things. " +
            "You can say, play cameron song and I will play a song that is a tribute to Cameron Gallagher. " +
            "You can say, give me a moment of mindfulness and I will help you relax. " +
            "or you can say 'learn more', and I will share more details about the foundations background. ";
        var repeat = "Please say something like, read me a quote to get started. ";
        this.emit(':ask', message, repeat);
    },
    'AMAZON.CancelIntent': function () {
	console.log("Cancel Requested");
        const message = "Help begins when we speak up. Start the conversation.";
        this.emit(':tell', message);
    },
    'AMAZON.StopIntent': function () {
	console.log("Stop Requested");

        const message = "Okay, what would you like to do next? " +
	    "Please say something like Play Cameron Song or Give Me a Moment of Mindfulness.";
	const repeat = "If you would like to play a song, please say Play Cameron Song. " +
	    "If you would rather try and relax, say Give Me a Moment of Mindfulness.";

	this.response.speak(message).listen(repeat);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        const message = "Help begins when we speak up. Start the conversation.";
        this.emit(':tell', message);
    },
    // this provides info on the foundation - either video or audio file
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
    'ProductInfo': function() {
	console.log('request made to provide information about premium version of skill');

	var returnData = [];

	// Information required to invoke the API is available in the session
	const apiEndpoint = "api.amazonalexa.com";
        const token  = "bearer " + this.event.context.System.apiAccessToken;
        const language    = this.event.request.locale;

        // The path for the in skill products API
        const apiPath     = "/v1/users/~current/skills/~current/inSkillProducts";

        const options = {
            host: apiEndpoint,
            path: apiPath,
            method: 'GET',
            headers: {
                "Content-Type"      : 'application/json',
                "Accept-Language"   : language,
                "Authorization"     : token
            }
        };

	console.log('ISP API:' + JSON.stringify(options));

	// Call the API to see if the extended version has already been purchased for this user
	const req = https.get(options, (res) => {
	    res.setEncoding("utf8");

	    res.on('data', (chunk) => {
		console.log("Chunk:" + chunk);
		returnData += chunk;
	    });

            req.on('error', (e) => {
            	console.log('Error calling InSkillProducts API: ' + e.message);
            	const message = 'Hmmm - something went wrong.  Please try again later.';
            	this.emit(':ask', message, message);
            });

	    res.on('end', () => {
		var userEntitlement = eval('(' + returnData + ')');
		console.log("Finished. API Code:" + res.statusCode);

		// vary response based on if the user has already purchased the game
		if (userEntitlement.inSkillProducts[0].entitled === 'ENTITLED') {
		    const thanksMessage = "Thank you for purchasing the full version of this skill. " +
			"You may play the entire song as you choose.";
			"Please say, Play Cameron Song to begin.";
		    const thanksReprompt = "If you would like to begin, please say Play Cameron Song.";

		    this.emit(':ask', thanksMessage, thanksReprompt);
		} else {
        	    const message = userEntitlement.inSkillProducts[0].summary + " If you would like to purchase this, please say " +
		        "Purchase full song. ";
		    const reprompt = "If you would like to purchase the extended version of this skill, please say, Purchase full song.";
		
        	    this.emit(':ask', message, reprompt);
		}
	    });
	});

	req.end();
    },
    // this gets invoked if the user requests to purchase the full version of the song
    'BuyFullVersion': function() {
	console.log('Request made to purchase full version of the song.');
	// this is the product id for the full version of the game
	const productId = full_length_prod;
	const correlationToken = this.event.context.System.apiAccessToken;

	// add directive to purchase the product
	this.response._addDirective(buildPurchaseDirective(correlationToken, productId));
	this.emit(':responseReady');
	console.log(JSON.stringify(this.response));
    },
    // this gets invoked if the user decides they don't want the full version of the song
    'RefundFullVersion': function() {
	console.log('Request made to refund the full version of the song.');

        // this is the product id for the full version of the game
        const productId = full_length_prod;
        const correlationToken = this.event.context.System.apiAccessToken;

        // add directive to purchase the product
        this.response._addDirective(buildRefundDirective(correlationToken, productId));
        this.emit(':responseReady');
        console.log(JSON.stringify(this.response));
    },
    // this function will play a random audio or video clip
    'PlayMindfulMoment': function() {
        console.log("Playing Mindful Moment");
        var message = "Here is today's moment of mindfulness exercise.";

        // generate a random number to select the mindful moments clip
        const msgSelection = Math.floor(Math.random() * mindfulMoments.length);

        // check if the device is an echo show or something with a screen
        if (this.event.context.System.device.supportedInterfaces.VideoApp) {
            console.log("Playing Mindful Video " + msgSelection);

            const videoObject = mindfulMoments[msgSelection].video;
            const videoTitle  = 'Mindful Moments';
            const videoClip   = mediaLocation + "videos/" + videoObject;

            // this will be rendered when the user selects video controls
            const metadata = {
                'title': videoTitle
            };

            this.response.playVideo(videoClip, metadata);
            this.emit(':responseReady');
        } else {
            console.log("Playing Mindful Audio " + msgSelection);
            // make valid SSML syntax for playing MP3
            var message = "Here is today's moment of mindfulness exercise.";
                message = message + "<audio src=\"" + mediaLocation + "mindfulMoments/" +
                mindfulMoments[msgSelection].audio + "\"/>";
            // add some closing language to be played after the music.
                message = message + "<break time=\"1s\"/>";
                message = message + "You can also ask Speak Up for a quote or play Camerons song.";
            const repeat = "Please say something like, read me a quote to get started. ";

            console.log("Message Played:" + message);

            this.emit(':askWithCard', message, repeat, imageObj);
        }
    },
    // this processes the events generated after a purchase transaction flow is completed
    'ProcessPurchaseEvent': function() {
        console.log("Purchase Result: " + this.event.request.payload.purchaseResult);

        if (this.event.request.payload.purchaseResult === 'ACCEPTED') {
            if (this.event.request.name === 'Cancel') {
                console.log("Successfully requested a refund.");

                const refundMessage = "You can still use the other features of the skill. " +
		    "Please say something like Teach Me a Moment of Mindfulness. ";
		const refundRepeat = "If you would like to do a relaxation drill, please " +
		    "say something like Teach me a moment of mindfulness.";

                this.response.speak(refundMessage).listen(refundRepeat);;
                this.emit(':responseReady');

            } else {
                console.log("Received acceptance message from purchase.");

                const message = "Thanks for purchasing. If you would like to play the full length version " +
                    "now, please say Play Cameron Song.";
                const reprompt = "If you would like to play the song, please say Play Cameron Song.";

                this.emit(':ask', message, reprompt);
            }
        } else if (this.event.request.payload.purchaseResult === 'ALREADY_PURCHASED') {
            console.log("Attempt to purchase song that already has been made.");

	    const message = "Would you like to play it now? Just say, Play Cameron Song.";
	    const repeat  = "You have already made a donation to the CKG Foundation. " +
		"If you would like to play the full version of Cameron Song by Christopher Minton, " +
		"Please say, Play Cameron Song.";

            this.response.speak(message).listen(repeat);
            this.emit(':responseReady');

        } else if (this.event.request.payload.purchaseResult === 'DECLINED') {
            console.log("Customer began purhase transaction, then declined.");

	    const message = "Let's go ahead and try somethign else. " +
		"If you would like a relaxation activity, please say Give me a Moment of Mindfulness.";
	    const repeat = "To begin a relaxation activity, please say something like " +
		"Give me a Moment of Mindfulness.";

	    this.response.speak(message).listen(repeat);
            this.emit(':responseReady');

        } else if (this.event.request.payload.purchaseResult === 'ERROR') {
            console.log("Error received during purchase transaction.");
            this.response.speak("Hmmm. Something didn't work. Please try again later.");
            this.emit(':responseReady');
        } else {
            console.log("Unknown error occurred during new session creation.");
            this.response.speak('Sorry, an error occurred. Please try again');
            this.emit(':responseReady');
        }
    },
    'System.ExceptionEncountered': function() {
	console.log("System Error Recorded.");
        console.log(this.event.request.error);
        console.log(this.event.request.cause);
    },
    'AudioControls': function() {
	console.log("Audio Controls Used");
	console.log(this.event.request.intent);

        // Don't end the session, and don't open the microphone.
        delete this.handler.response.response.shouldEndSession;

	// Location of full version of Cameron's Song
	const urlAudioFile = "https://s3.amazonaws.com/camerongallagherfoundation/audio/CameronsSongFull.mp3";

	// If user has requested pausing the music, add stop directive
        if (this.event.request.intent.name === 'AMAZON.PauseIntent') {
	    this.response._addDirective(buildAudioStopDirective());
	} else if (this.event.request.intent.name === 'AMAZON.CancelIntent') {
            this.response._addDirective(buildAudioStopDirective());
	// If user wants to resume, play and provide the last stopping point
	} else if (this.event.request.intent.name === 'AMAZON.ResumeIntent') {
            this.response._addDirective(buildAudioPlayDirective(urlAudioFile, this.event.context.AudioPlayer.offsetInMilliseconds));
	// If user wants to start over, play from the beginning
	} else if (this.event.request.intent.name === 'AMAZON.StartOverIntent') {
            this.response._addDirective(buildAudioPlayDirective(urlAudioFile, 0));
	}

        this.emit(':responseReady');
    },
    'Unhandled': function() {
	if (this.event.request.type === 'AudioPlayer.PlaybackFinished') {
	    this.emit('AudioPlayer.PlaybackFinished');
	} else if (this.event.request.type === 'AudioPlayer.PlaybackStarted') {
	    this.emit('AudioPlayer.PlaybackStarted');
	} else if (this.event.request.type === 'AudioPlayer.PlaybackStopped') {
	    this.emit('AudioPlayer.PlaybackStopped');
	} else if (this.event.request.type === 'AudioPlayer.PlaybackNearlyFinished') {
	    this.emit('AudioPlayer.PlaybackNearlyFinished');
	} else {
            console.log("UNHANDLED");
            var message = "I'm sorry, I didn't understand your request. Please try again.";
            this.emit(':tell', message);
	}
    },
    // this event gets triggered when the full version of Cameron's Song begins
    'AudioPlayer.PlaybackStarted': function() {
        console.log("Playback Started on Alexa Skill.");

        // Don't end the session, and don't open the microphone.
        delete this.handler.response.response.shouldEndSession;

        this.emit(':responseReady');
    },
    // this event gets triggered when the song is complete
    'AudioPlayer.PlaybackFinished': function() {
        console.log("Playback Finished on Alexa Skil.");

        // Don't end the session, and don't open the microphone.
        delete this.handler.response.response.shouldEndSession;

        this.emit(':responseReady');
    },
    // this event gets triggered when the song is paused
    'AudioPlayer.PlaybackStopped': function() {
	console.log("Playback Stopped or Paused within the Alexa Skill.");

        // Don't end the session, and don't open the microphone.
        delete this.handler.response.response.shouldEndSession;

        this.emit(':responseReady');
    },
    // this event gets triggered when the song is almost complete
    'AudioPlayer.PlaybackNearlyFinished': function() {
        console.log("Song almost complete.");

        // Don't end the session, and don't open the microphone.
        delete this.handler.response.response.shouldEndSession;

        this.emit(':responseReady');
    }	
};

// this is the directive that builds the response needed to purchase a product
const buildPurchaseDirective = function(correlationToken, productId) {
    return {
	"type": "Connections.SendRequest",
	"name": "Buy",
	"payload": {
	    "InSkillProduct": {
		"productId": productId
	    }
	},
	"token": correlationToken
    }
};

// this is the directive that builds the response needed to purchase a product
const buildRefundDirective = function(correlationToken, productId) {
    return {
        "type": "Connections.SendRequest",
        "name": "Cancel",
        "payload": {
            "InSkillProduct": {
                "productId": productId
            }
        },
        "token": correlationToken
    }
};

// this is the directive that builds the response needed to stop a media file
const buildAudioStopDirective = function() {
    return {
	"type": "AudioPlayer.Stop"
    }
};

// this is the directive that builds the response needed to play a media file
const buildAudioPlayDirective = function(urlAudioFile, offset) {
    return {
        "type": "AudioPlayer.Play",
	"playBehavior": "REPLACE_ALL",
	"audioItem": {
	    "stream": {
		"url": urlAudioFile,
		"token": "SPEAKUP001",
		"offsetInMilliseconds": offset
	    },
	    "metadata": {
	    	"title": "Song Title",
	    	"subtitle": "Artist Name",
	    	"art": {
		    "sources": [
		    	{
			    "url": "https://s3.amazonaws.com/camerongallagherfoundation/images/small.png"
		        }
		    ]
	    	},
	    },
	    "backgroundImage": {
		"sources": [
		    {
			"url": "https://s3.amazonaws.com/camerongallagherfoundation/images/background.png"
		    }
		]
	    }
	}
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;

    // log event data for every request
    console.log(JSON.stringify(event));

    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
