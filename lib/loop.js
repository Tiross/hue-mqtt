'use strict';

const lights = require('./lights');
const sensors = require('./sensors');
const output = require('./output');

const wait = (bridge) => {
  return new Promise((resolve) => {
    output.log('Waiting %dms', bridge.interval);
    setTimeout(resolve, bridge.interval, bridge);
  });
};

const loop = (bridge) => {
  return sensors(bridge)
    .then(lights)
    .then(wait)
    .then(loop)
  ;
};

module.exports = loop;
