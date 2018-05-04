'use strict';

let userConfig = {
  broker: {},
};

module.exports = userConfig;

module.exports.parse = (config) => {
  userConfig.verbose = config.verbose || false;

  if (typeof(config.broker) === 'undefined') {
    config.broker = {};
  }

  userConfig.broker.host = config.broker.host || 'localhost';
  userConfig.broker.username = config.broker.username || '';
  userConfig.broker.password = config.broker.password || '';
  userConfig.broker.qos = config.broker.qos || 0;

  userConfig.bridges = [];

  if (typeof(config.bridges) === 'undefined') {
    config.bridges = [];
  }

  config.bridges.forEach((bridge, index) => {
    let defaultPrefix = 'hue';

    if (config.bridges.length > 1) {
      defaultPrefix += '/' + (index + 1);
    }

    bridge.interval = bridge.interval || 500;
    bridge.prefix = bridge.prefix || defaultPrefix;
    bridge.excludes = bridge.excludes || [];

    bridge.sensors = {};
    bridge.lights = {};

    userConfig.bridges.push(bridge);
  });

  return userConfig;
};
