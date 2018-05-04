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

  prev.level = sensor.state.lightlevel;
  prev.brightness = Math.round(Math.pow(10, (sensor.state.lightlevel - 1) / 10000), 0);
  prev.updated = lastUpdated;

  prev.isDark = sensor.state.dark;
  prev.isDayLight = sensor.state.daylight;

  prev.battery = sensor.config.battery;

  publish(prev.topic, JSON.stringify(omit(prev, privateKeys)));

  resolve();
});
