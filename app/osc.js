var osc = require('osc');
var os = require('os');

/****************
 * OSC Over UDP *
 ****************/

var getIPAddresses = function() {
  var interfaces = os.networkInterfaces(),
    ipAddresses = [];

  for (var deviceName in interfaces) {
    var addresses = interfaces[deviceName];
    for (var i = 0; i < addresses.length; i++) {
      var addressInfo = addresses[i];
      if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
        ipAddresses.push(addressInfo.address);
      }
    }
  }

  return ipAddresses;
};

class OSC {
  constructor(messageHandler) {
    var udpPort = new osc.UDPPort({
      localAddress: '0.0.0.0',
      localPort: 8081,
    });

    udpPort.on('ready', function() {
      var ipAddresses = getIPAddresses();

      console.log('Listening for OSC over UDP.');
      ipAddresses.forEach(function(address) {
        console.log(' Host:', address + ', Port:', udpPort.options.localPort);
      });
    });

    udpPort.on('error', function(err) {
      console.log(err);
    });

    udpPort.on('message', messageHandler);

    udpPort.open();
  }
}

module.exports = { OSC };
