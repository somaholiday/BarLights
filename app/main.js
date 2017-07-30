var keypress = require('keypress');
var { OSC } = require('./osc');
var OPC = new require('./opc');
var client = new OPC('localhost', 7890);

var STRIP_COUNT = 3;
var PIXEL_COUNT = 31;
var FADE_TIME = 750; //ms

function handleOSC(message) {
  console.log(message);
  toggleOpen(message.args[0]);
}

const osc = new OSC(handleOSC);

//////////////////////
// BEGIN ALGORITHMS //
//////////////////////

var firstProperty = function(obj) {
  var keys = Object.keys(obj);
  return obj[keys[0]];
};

var randomProperty = function(obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

var algorithms = {
  sineWaveFadeIn: {
    name: 'sineWaveFadeIn',

    open: function() {
      var millis = new Date().getTime();
      var timeSinceChange = millis - lastChange;

      var fadeFactor = Math.min(1, timeSinceChange / FADE_TIME);

      for (var strip = 0; strip < STRIP_COUNT; strip++) {
        for (var pixel = 0; pixel < PIXEL_COUNT; pixel++) {
          var t = pixel * 0.2 + millis * 0.002;
          var red = 128 + 96 * Math.sin(t);
          var green = 128 + 96 * Math.sin(t + 0.1);
          var blue = 128 + 96 * Math.sin(t + 0.3);

          client.setPixel(strip * 64 + pixel, fadeFactor * red, fadeFactor * green, fadeFactor * blue);
        }
      }
    },

    closed: function() {
      var millis = new Date().getTime();
      var timeSinceChange = millis - lastChange;

      var fadeFactor = 1 - Math.min(1, timeSinceChange / FADE_TIME);

      if (timeSinceChange > FADE_TIME) {
        for (var strip = 0; strip < STRIP_COUNT; strip++) {
          for (var pixel = 0; pixel < PIXEL_COUNT; pixel++) {
            client.setPixel(strip * 64 + pixel, 0, 0, 0);
          }
        }
      } else {
        for (var strip = 0; strip < STRIP_COUNT; strip++) {
          for (var pixel = 0; pixel < PIXEL_COUNT; pixel++) {
            var t = pixel * 0.2 + millis * 0.002;
            var red = 128 + 96 * Math.sin(t);
            var green = 128 + 96 * Math.sin(t + 0.1);
            var blue = 128 + 96 * Math.sin(t + 0.3);

            client.setPixel(strip * 64 + pixel, fadeFactor * red, fadeFactor * green, fadeFactor * blue);
          }
        }
      }
    },
  },

  somethingElse: {
    name: 'somethingElse',

    open: function() {
      var millis = new Date().getTime();
      var timeSinceChange = millis - lastChange;

      var fadeFactor = Math.min(1, timeSinceChange / FADE_TIME);

      for (var strip = 0; strip < STRIP_COUNT; strip++) {
        for (var pixel = 0; pixel < PIXEL_COUNT; pixel++) {
          var t = pixel * 0.2 + millis * 0.002;
          var red = 128 + 96 * Math.sin(t);
          var green = 128 + 96 * Math.sin(t + 1.1);
          var blue = 128 + 96 * Math.sin(t + 0.3);

          client.setPixel(strip * 64 + pixel, fadeFactor * red, fadeFactor * green, fadeFactor * blue);
        }
      }
    },

    closed: function() {
      var millis = new Date().getTime();
      var timeSinceChange = millis - lastChange;

      var fadeFactor = 1 - Math.min(1, timeSinceChange / FADE_TIME);

      if (timeSinceChange > FADE_TIME) {
        for (var strip = 0; strip < STRIP_COUNT; strip++) {
          for (var pixel = 0; pixel < PIXEL_COUNT; pixel++) {
            client.setPixel(strip * 64 + pixel, 0, 0, 0);
          }
        }
      } else {
        for (var strip = 0; strip < STRIP_COUNT; strip++) {
          for (var pixel = 0; pixel < PIXEL_COUNT; pixel++) {
            var t = pixel * 0.2 + millis * 0.002;
            var red = 128 + 96 * Math.sin(t);
            var green = 128 + 96 * Math.sin(t + 0.1);
            var blue = 128 + 96 * Math.sin(t + 0.3);

            client.setPixel(strip * 64 + pixel, fadeFactor * red, fadeFactor * green, fadeFactor * blue);
          }
        }
      }
    },
  },
};

////////////////////
// END ALGORITHMS //
////////////////////

function toggleOpen(open) {
  if (typeof open === undefined) {
    isOpen = !isOpen;
  } else {
    isOpen = open;
  }

  console.log('isOpen : ' + isOpen);
  lastChange = new Date().getTime();
}

var isOpen = false;
var lastChange = 0;
var currentAlgorithm = firstProperty(algorithms);

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

process.stdin.on('keypress', function(ch, key) {
  // console.log('got "keypress"', key);

  if (key && key.name == 'space') {
    toggleOpen();
  }

  if (key && key.name == 'a') {
    currentAlgorithm = randomProperty(algorithms);
    console.log('currentAlgorithm : ' + currentAlgorithm.name);
  }

  if (key && key.ctrl && key.name == 'c') {
    process.exit();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

function draw() {
  if (isOpen) {
    currentAlgorithm.open();
  } else {
    currentAlgorithm.closed();
  }
  client.writePixels();
}

setInterval(draw, 17); // aim for 60fps : 1000 / 60 ~= 17
