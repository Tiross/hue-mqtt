'use strict';

const omit = require('object.omit');
const publish = require('../mqtt').publish;

const privateKeys = [
  'topic',
];

module.exports = (prev, sensor) => new Promise((resolve) => {
  const lastUpdated = new Date(sensor.state.lastupdated);

  if (!sensor.config.configured || prev.updated >= lastUpdated || sensor.config.usertest) {
    return resolve();
  }

  prev.daylight = sensor.state.daylight;
  prev.updated = lastUpdated;

  prev.offset = {
    sunrise: sensor.config.sunriseoffset,
    sunset: sensor.config.sunsetoffset,
  };

  publish(prev.topic, JSON.stringify(omit(prev, privateKeys)), {
    retain: true,
  });

  resolve();
});
