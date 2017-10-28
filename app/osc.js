const osc = require('osc');
const os = require('os');

/****************
 * OSC Over UDP *
 ****************/

const getIPAddresses = function() {
  const interfaces = os.networkInterfaces(),
    ipAddresses = [];

  for (const deviceName in interfaces) {
    const addresses = interfaces[deviceName];
    for (let i = 0; i < addresses.length; i++) {
      const addressInfo = addresses[i];
      if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
        ipAddresses.push(addressInfo.address);
      }
    }
  }

  return ipAddresses;
};

class OSC {
  constructor(messageHandler) {
    const udpPort = new osc.UDPPort({
      localAddress: '0.0.0.0',
      localPort: 8081,
    });

    udpPort.on('ready', function() {
      const ipAddresses = getIPAddresses();

      console.log('Listening for OSC over UDP.');
      ipAddresses.forEach(function(address) {
        console.log(` Host: ${address}, Port: ${udpPort.options.localPort}`);
      });
    });

    udpPort.on('error', function(err) {
      console.log(err);
    });

    udpPort.on('message', messageHandler);

    udpPort.on('osc', function(packet) {
      console.log(`OSC EVENT`, packet);
    });

    udpPort.open();
  }
}

module.exports = { OSC };
