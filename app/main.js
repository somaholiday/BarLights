var OPC = new require("./app/fadecandy/examples/node/opc")
var client = new OPC("server", 7890);

var Gpio = require("onoff").Gpio;
var hallPin = new Gpio( 4, "in", "both" );

var PIXEL_COUNT = 31;
var FADE_TIME = 750; //ms

var isOpen = false;
var lastChange = 0;

hallPin.watch( function(err, value) {
	if (err) throw err;
	
	isOpen = !!value;

	console.log("isOpen : " + isOpen);

  lastChange = new Date().getTime();
});

function exit() {
	hallPin.unexport();
}

process.on("SIGINT", exit);


function draw() {
	if (isOpen) {
    var millis = new Date().getTime();
    var timeSinceChange = millis - lastChange;

    var fadeFactor = Math.min(1, timeSinceChange / FADE_TIME);

		for ( var pixel = 0; pixel < PIXEL_COUNT; pixel++ ) {
			var t = pixel * 0.2 + millis * 0.002;
			var red =   128 + 96 * Math.sin(t);
			var green = 128 + 96 * Math.sin(t + 0.1);
			var blue =  128 + 96 * Math.sin(t + 0.3);

			client.setPixel( pixel, fadeFactor * red, fadeFactor * green, fadeFactor * blue ); 
		}
	} else {


		for ( var pixel = 0; pixel < PIXEL_COUNT; pixel++ ) {
			client.setPixel( pixel, 0, 0, 0 );
		}
	}
	client.writePixels();
}

setInterval(draw, 30);

