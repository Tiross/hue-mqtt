'use strict';

const omit = require('object.omit');
const publish = require('../mqtt').publish;

const privateKeys = [
  'topic',
];

const eventsList = {
  '34': 'button/1',
  '16': 'button/2',
  '17': 'button/3',
  '18': 'button/4',
};

module.exports = (prev, sensor) => new Promise((resolve) => {
  const lastUpdated = new Date(sensor.state.lastupdated);
  const topic = [
    prev.topic,
    eventsList[sensor.state.buttonevent],
  ];

  if (prev.updated >= lastUpdated || sensor.config.usertest) {
    return resolve();
  }

  prev.eventCode = sensor.state.buttonevent;
  prev.updated = lastUpdated;

  publish(topic.join('/'), JSON.stringify(omit(prev, privateKeys)));

  resolve();
});
