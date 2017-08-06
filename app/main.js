const _ = require('lodash');
const keypress = require('keypress');
const { OSC } = require('./osc');
const OPC = new require('./opc');
const client = new OPC('localhost', 7890);

const STRIP_COUNT = 3;
const PIXEL_COUNT = 31;
const FADE_TIME = 750; //ms

function handleOSC(message) {
  const { address, args } = message;
  const parts = _(address).split('/').compact().value();

  console.log(message);

  // first part is TouchOSC page number (we don't currently care)
  switch (parts[0]) {
    default:
      switch (parts[1]) {
        case 'power':
          toggleOpen(args[0]);
          break;
        case 'solid':
          toggleSolid(args[0]);
          break;
        case 'hue':
          updateHue(parts[2], args[0]);
      }
  }
}

const osc = new OSC(handleOSC);

//////////////////////
// BEGIN ALGORITHMS //
//////////////////////

let algorithms = {
  sineWaveFadeIn: {
    name: 'sineWaveFadeIn',

    open() {
      let millis = Date.now();
      let timeSinceChange = millis - lastChange;

      let fadeFactor = Math.min(1, timeSinceChange / FADE_TIME);

      for (let strip = 0; strip < STRIP_COUNT; strip++) {
        for (let pixel = 0; pixel < PIXEL_COUNT; pixel++) {
          let t = pixel * 0.2 + millis * 0.002;
          let red = 128 + 96 * Math.sin(t);
          let green = 128 + 96 * Math.sin(t + 0.1);
          let blue = 128 + 96 * Math.sin(t + 0.3);

          client.setPixel(strip * 64 + pixel, fadeFactor * red, fadeFactor * green, fadeFactor * blue);
        }
      }
    },

    closed() {
      let millis = Date.now();
      let timeSinceChange = millis - lastChange;

      let fadeFactor = 1 - Math.min(1, timeSinceChange / FADE_TIME);

      if (timeSinceChange > FADE_TIME) {
        for (let strip = 0; strip < STRIP_COUNT; strip++) {
          for (let pixel = 0; pixel < PIXEL_COUNT; pixel++) {
            client.setPixel(strip * 64 + pixel, 0, 0, 0);
          }
        }
      } else {
        for (let strip = 0; strip < STRIP_COUNT; strip++) {
          for (let pixel = 0; pixel < PIXEL_COUNT; pixel++) {
            let t = pixel * 0.2 + millis * 0.002;
            let red = 128 + 96 * Math.sin(t);
            let green = 128 + 96 * Math.sin(t + 0.1);
            let blue = 128 + 96 * Math.sin(t + 0.3);

            client.setPixel(strip * 64 + pixel, fadeFactor * red, fadeFactor * green, fadeFactor * blue);
          }
        }
      }
    },
  },

  solid: {
    name: 'solid',

    open() {
      let millis = Date.now();
      let timeSinceChange = millis - lastChange;

      let fadeFactor = Math.min(1, timeSinceChange / FADE_TIME);
      const { r, g, b } = hue;

      for (let strip = 0; strip < STRIP_COUNT; strip++) {
        for (let pixel = 0; pixel < PIXEL_COUNT; pixel++) {
          client.setPixel(strip * 64 + pixel, fadeFactor * r, fadeFactor * g, fadeFactor * b);
        }
      }
    },

    closed() {
      let millis = Date.now();
      let timeSinceChange = millis - lastChange;

      let fadeFactor = 1 - Math.min(1, timeSinceChange / FADE_TIME);
      const { r, g, b } = hue;

      for (let strip = 0; strip < STRIP_COUNT; strip++) {
        for (let pixel = 0; pixel < PIXEL_COUNT; pixel++) {
          client.setPixel(strip * 64 + pixel, fadeFactor * r, fadeFactor * g, fadeFactor * b);
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

function toggleSolid(solid) {
  currentAlgorithm = solid ? algorithms.solid : algorithms.sineWaveFadeIn;
}

function updateHue(channel, value) {
  hue[channel] = 255 * value;
}

let isOpen = false;
let lastChange = 0;
let currentAlgorithm = algorithms.sineWaveFadeIn;
let hue = {
  r: 0,
  g: 0,
  b: 0,
};

// // make `process.stdin` begin emitting "keypress" events
// keypress(process.stdin);

// process.stdin.on('keypress', function(ch, key) {
//   // console.log('got "keypress"', key);

//   if (key && key.name == 'space') {
//     toggleOpen();
//   }

//   if (key && key.name == 'a') {
//     currentAlgorithm = randomProperty(algorithms);
//     console.log('currentAlgorithm : ' + currentAlgorithm.name);
//   }

//   if (key && key.ctrl && key.name == 'c') {
//     process.exit();
//   }
// });

// process.stdin.setRawMode(true);
// process.stdin.resume();

function draw() {
  if (isOpen) {
    currentAlgorithm.open();
  } else {
    currentAlgorithm.closed();
  }
  client.writePixels();
}

setInterval(draw, 17); // aim for 60fps : 1000 / 60 ~= 17
