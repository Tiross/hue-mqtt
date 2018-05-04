'use strict';

const omit = require('object.omit');
const publish = require('../mqtt').publish;

const privateKeys = [
  'topic',
];

module.exports = (prev, sensor) => new Promise((resolve) => {
  const lastUpdated = new Date(sensor.state.lastupdated);

  if (prev.updated >= lastUpdated || sensor.config.usertest) {
    return resolve();
  }

  prev.temperature = sensor.state.temperature / 100;
  prev.updated = lastUpdated;

  prev.battery = sensor.config.battery;

  publish(prev.topic, JSON.stringify(omit(prev, privateKeys)));

  resolve();
});
