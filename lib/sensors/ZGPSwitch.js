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

  prev.event = sensor.state.buttonevent;
  prev.updated = lastUpdated;

  publish(prev.topic, JSON.stringify(omit(prev, privateKeys)));

  resolve();
});
