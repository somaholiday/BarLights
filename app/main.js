const _ = require('lodash');
const { OSC } = require('./osc');
const OPC = new require('./lib/opc');
const client = new OPC('localhost', 7890);

const STRIP_COUNT = 3;
const PIXEL_COUNT = 31;
const FADE_TIME = 750; //ms

/**
 * OSC API
 *
 * /1/power
 *   0 on/off : boolean
 *
 * /1/solid
 *   0 on/off : boolean
 *
 * /1/hue/r
 * /1/hue/g
 * /1/hue/b
 *   0 value : number [0-1]
 *
 * @param message
 */
function handleOSC(message) {
  const { address, args } = message;
  const parts = _(address).split('/').compact().value();

  console.log(`Received OSC message:`, message);

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

const algorithms = {
  sineWaveFadeIn: {
    name: 'sineWaveFadeIn',

    open() {
      const millis = Date.now();
      const timeSinceChange = millis - lastChange;

      const fadeFactor = Math.min(1, timeSinceChange / FADE_TIME);

      _.each(_.range(STRIP_COUNT), strip => {
        _.each(_.range(PIXEL_COUNT), pixel => {
          const t = pixel * 0.2 + millis * 0.002;
          const red = 128 + 96 * Math.sin(t);
          const green = 128 + 96 * Math.sin(t + 0.1);
          const blue = 128 + 96 * Math.sin(t + 0.3);

          client.setPixel(strip * 64 + pixel, fadeFactor * red, fadeFactor * green, fadeFactor * blue);
        });
      });
    },

    closed() {
      const millis = Date.now();
      const timeSinceChange = millis - lastChange;

      const fadeFactor = 1 - Math.min(1, timeSinceChange / FADE_TIME);

      if (timeSinceChange > FADE_TIME) {
        _.each(_.range(STRIP_COUNT), strip => {
          _.each(_.range(PIXEL_COUNT), pixel => {
            client.setPixel(strip * 64 + pixel, 0, 0, 0);
          });
        });
      } else {
        _.each(_.range(STRIP_COUNT), strip => {
          _.each(_.range(PIXEL_COUNT), pixel => {
            const t = pixel * 0.2 + millis * 0.002;
            const red = 128 + 96 * Math.sin(t);
            const green = 128 + 96 * Math.sin(t + 0.1);
            const blue = 128 + 96 * Math.sin(t + 0.3);

            client.setPixel(strip * 64 + pixel, fadeFactor * red, fadeFactor * green, fadeFactor * blue);
          });
        });
      }
    },
  },

  solid: {
    name: 'solid',

    open() {
      const millis = Date.now();
      const timeSinceChange = millis - lastChange;

      const fadeFactor = Math.min(1, timeSinceChange / FADE_TIME);
      const [r, g, b] = _.map(STATE.hue, c => c * 255);

      _.each(_.range(STRIP_COUNT), strip => {
        _.each(_.range(PIXEL_COUNT), pixel => {
          client.setPixel(strip * 64 + pixel, fadeFactor * r, fadeFactor * g, fadeFactor * b);
        });
      });
    },

    closed() {
      const millis = Date.now();
      const timeSinceChange = millis - lastChange;

      const fadeFactor = 1 - Math.min(1, timeSinceChange / FADE_TIME);
      const [r, g, b] = _.map(STATE.hue, c => c * 255);

      if (timeSinceChange > FADE_TIME) {
        _.each(_.range(STRIP_COUNT), strip => {
          _.each(_.range(PIXEL_COUNT), pixel => {
            client.setPixel(strip * 64 + pixel, 0, 0, 0);
          });
        });
      } else {
        _.each(_.range(STRIP_COUNT), strip => {
          _.each(_.range(PIXEL_COUNT), pixel => {
            client.setPixel(strip * 64 + pixel, fadeFactor * r, fadeFactor * g, fadeFactor * b);
          });
        });
      }
    },
  },
};

////////////////////
// END ALGORITHMS //
////////////////////

function toggleOpen(open) {
  if (typeof open === undefined) {
    STATE.isOpen = !STATE.isOpen;
  } else {
    STATE.isOpen = open;
  }

  console.log(`isOpen : ${STATE.isOpen}`);
  lastChange = Date.now();
}

function toggleSolid(solid) {
  STATE.currentAlgorithm = solid ? algorithms.solid : algorithms.sineWaveFadeIn;
}

function updateHue(channel, value) {
  STATE.hue[channel] = value;
}

const STATE = {
  isOpen: false,
  currentAlgoritm: algorithms.sineWaveFadeIn,
  hue: {
    r: 1,
    g: 1,
    b: 1,
  },
};

let lastChange = 0;

function draw() {
  if (STATE.isOpen) {
    STATE.currentAlgorithm.open();
  } else {
    STATE.currentAlgorithm.closed();
  }
  client.writePixels();
}

setInterval(draw, 17); // aim for 60fps : 1000 / 60 ~= 17
