'use strict';

const omit = require('object.omit');
const publish = require('../mqtt').publish;

const privateKeys = [
  'topic',
];

const buttons = [
  'none',
  'on',
  'up',
  'down',
  'off',
];

const events = [
  'initial',
  'hold',
  'short',
  'long',
];

module.exports = (prev, sensor) => new Promise((resolve) => {
  const lastUpdated = new Date(sensor.state.lastupdated);
  const buttonCode = Math.round(sensor.state.buttonevent / 1000);
  const eventCode = sensor.state.buttonevent % 1000;
  const topic = [
    prev.topic,
    'button',
    buttons[buttonCode],
    events[eventCode],
  ];

  if (prev.updated >= lastUpdated || sensor.config.usertest) {
    return resolve();
  }

  prev.eventCode = sensor.state.buttonevent;
  prev.updated = lastUpdated;

  prev.battery = sensor.config.battery;

  publish(topic.join('/'), JSON.stringify(omit(prev, privateKeys)));

  resolve();
});
