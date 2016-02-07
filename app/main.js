var OPC = new require("../../../fadecandy/examples/node/opc")
var client = new OPC("localhost", 7890);

var STRIP_COUNT = 3;
var PIXEL_COUNT = 31;
var FADE_TIME = 750; //ms

var isOpen = true;
var lastChange = 0;

function draw() {
    if (isOpen) {

        var millis = new Date().getTime();
        var timeSinceChange = millis - lastChange;

        var fadeFactor = Math.min(1, timeSinceChange / FADE_TIME);
        for (var strip = 0; strip < STRIP_COUNT; strip++) {
            for (var pixel = 0; pixel < PIXEL_COUNT; pixel++) {
                var t = pixel * 0.2 + millis * 0.002;
                var red = 0;//128 + 96 * Math.sin(t);
                var green = 0;//128 + 96 * Math.sin(t + 0.1);
                var blue = 128 + 96 * Math.sin(t + 0.3);

                client.setPixel((strip * 64) + pixel, fadeFactor * red, fadeFactor * green, fadeFactor * blue);
            }
        }

    } else {
        var millis = new Date().getTime();
        var timeSinceChange = millis - lastChange;

        if (timeSinceChange > FADE_TIME) {
            for (var strip = 0; strip < STRIP_COUNT; strip++) {
                for (var pixel = 0; pixel < PIXEL_COUNT; pixel++) {
                    client.setPixel((strip * 64) + pixel, 0, 0, 0);
                }
            }
        } else {
            var fadeFactor = 1 - Math.min(1, timeSinceChange / FADE_TIME);

            for (var strip = 0; strip < STRIP_COUNT; strip++) {
                for (var pixel = 0; pixel < PIXEL_COUNT; pixel++) {
                    var t = pixel * 0.2 + millis * 0.002;
                    var red = 128 + 96 * Math.sin(t);
                    var green = 128 + 96 * Math.sin(t + 0.1);
                    var blue = 128 + 96 * Math.sin(t + 0.3);

                    client.setPixel((strip * 64) + pixel, fadeFactor * red, fadeFactor * green, fadeFactor * blue);
                }
            }
        }

    }
    client.writePixels();
}

setInterval(draw, 30);
