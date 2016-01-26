var OPC = new require("./fadecandy/examples/node/opc")
var client = new OPC("barlights_server", 7890);

var Gpio = require("onoff").Gpio;
var hallPin = new Gpio( 4, "in", "both" );

var isOpen = false;

hallPin.watch( function(err, value) {
	if (err) throw err;
	
	isOpen = !!value;

	console.log("isOpen : " + isOpen);
});

function exit() {
	hallPin.unexport();
}

process.on("SIGINT", exit);


function draw() {
	if (isOpen) {
		var millis = new Date().getTime();

		for ( var pixel = 0; pixel < 64; pixel++ ) {
			var t = pixel * 0.2 + millis * 0.002;
			var red =   128 + 96 * Math.sin(t);
			var green = 128 + 96 * Math.sin(t + 0.1);
			var blue =  128 + 96 * Math.sin(t + 0.3);

			client.setPixel( pixel, red, green, blue ); 
		}
	} else {
		for ( var pixel = 0; pixel < 64; pixel++ ) {
			client.setPixel( pixel, 0, 0, 0 );
		}
	}
	client.writePixels();
}

setInterval(draw, 30);

