'use strict';

const convert = require('color-convert');
const omit = require('object.omit');
const request = require('./request');
const publish = require('./mqtt').publish;

const privateKeys = [
  'topic',
];

const parseLight = (bridge, light, id) => new Promise((resolve) => {
  const uniqueid = light.uniqueid;
  let needUpdate = false;
  let prev;

  if (!bridge.lights.hasOwnProperty(uniqueid)) {
    bridge.lights[uniqueid] = {
      id: parseInt(id, 10),
      name: light.name,
      product: light.productname,
      topic: bridge.prefix + '/light/' + (bridge.topics[uniqueid] || id),
      uniqueid: uniqueid,
      origin: {
        hue: 0,
        saturation: 0,
        brightness: 0,
      },
    };
  }

  if (bridge.excludes.indexOf(uniqueid) !== -1) {
    return resolve();
  }

  if (!light.state.reachable) {
    return resolve();
  }

  prev = bridge.lights[uniqueid];

  if (prev.on !== light.state.on) {
    needUpdate = true;
  }

  if (prev.origin.hue !== light.state.hue) {
    needUpdate = true;
  }

  if (prev.origin.saturation !== light.state.sat) {
    needUpdate = true;
  }

  if (prev.origin.brightness !== light.state.bri) {
    needUpdate = true;
  }

  if (needUpdate) {
    prev.on = light.state.on;
    prev.updated = new Date;

    prev.xy = light.state.xy;

    prev.origin.hue = light.state.hue;
    prev.origin.saturation = light.state.sat;
    prev.origin.brightness = light.state.bri;

    prev.hue = Math.round(light.state.hue / 65535 * 36000) / 100;
    prev.saturation = Math.round(light.state.sat / 255 * 10000) / 100;
    prev.brightness = Math.round(light.state.bri / 255 * 10000) / 100;

    prev.hex = convert.hsv.hex(prev.hue, prev.saturation, prev.brightness);
    prev.rgb = convert.hsv.rgb(prev.hue, prev.saturation, prev.brightness);

    prev.red = prev.rgb[0];
    prev.green = prev.rgb[1];
    prev.blue = prev.rgb[2];

    publish(prev.topic, JSON.stringify(omit(prev, privateKeys)));
  }

  return resolve();
});

module.exports = (bridge) => {
  return request(bridge, 'lights')
    .then((data) => new Promise((resolve) => {
      const promises = [];

      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          promises.push(parseLight(bridge, data[key], key));
        }
      }

      return Promise.all(promises).then(resolve(bridge));
    }))
  ;
};
