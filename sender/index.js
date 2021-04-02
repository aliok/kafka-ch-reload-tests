const {CloudEvent, HTTPEmitter} = require("cloudevents-sdk");

const SEND_DURATION = 2 * 60 * 1000;	// N mins
const SEND_FREQUENCY = 10;	// N ms

let sinkUrl = process.env['K_SINK'];

console.log("Sink URL is " + sinkUrl);

let emitter = new HTTPEmitter({
	url: sinkUrl
});

let startTime = new Date().getTime();

let eventIndex = 0;
let success = 0;
let error = 0;
let internal = setInterval(function () {
	let currentTime = new Date().getTime();
	console.log("Emitting event #" + ++eventIndex + ". Remaining time (in seconds): " + ((startTime + SEND_DURATION - currentTime) / 1000));

	let myevent = new CloudEvent({
		source: "urn:event:from:my-api/resource/123",
		type: "your.event.source.type",
		id: "your-event-id",
		dataContentType: "application/json",
		data: {"hello": "World " + eventIndex},
	});

	// Emit the event
	emitter.send(myevent)
		.then(response => {
			// Treat the response
			console.log("Event #" + eventIndex + " posted successfully");
			success++;
		})
		.catch(err => {
			// Deal with errors
			console.log("Error during event post");
			console.error(err);
			error++;
		});

	if (startTime + SEND_DURATION <= currentTime) {
		clearInterval(internal);
		console.log("Stopped sending messages.");
		console.log("In " + (SEND_DURATION / 1000) + " seconds, tried to send " + eventIndex + "messages");
		console.log("Success:" + success);
		console.log("Errors:" + error);
		console.log("Starting to sleep now");
		setInterval(function () {
			// sleep forever until killed
		}, 1000);
	}

}, SEND_FREQUENCY);

registerGracefulExit();

function registerGracefulExit() {
	let logExit = function () {
		console.log("Exiting");
		process.exit();
	};

	// handle graceful exit
	//do something when app is closing
	process.on('exit', logExit);
	//catches ctrl+c event
	process.on('SIGINT', logExit);
	process.on('SIGTERM', logExit);
	// catches "kill pid" (for example: nodemon restart)
	process.on('SIGUSR1', logExit);
	process.on('SIGUSR2', logExit);
}
