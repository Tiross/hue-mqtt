'use strict';

const crypto = require('crypto');
const request = require('./request');

const sensors = {};

[
  'Daylight',
  'ZGPSwitch',
  'ZLLLightLevel',
  'ZLLPresence',
  'ZLLSwitch',
  'ZLLTemperature',
].forEach((type) => {
  sensors[type] = require('./sensors/' + type);
});

const updated = new Date;

updated.setFullYear(updated.getFullYear() - 1);

const parseSensor = (bridge, sensor, id) => new Promise((resolve, reject) => {
  const hash = crypto.createHash('sha256');

  let uniqueid = sensor.uniqueid;

  if (typeof(uniqueid) === 'undefined') {
    hash.update(sensor.manufacturername + '#' + sensor.modelid);

    uniqueid = hash.digest('hex');
  }

  if (!bridge.sensors.hasOwnProperty(uniqueid)) {
    bridge.sensors[uniqueid] = {
      id: parseInt(id, 10),
      name: sensor.name,
      topic: bridge.prefix + '/sensor/' + (bridge.topics[uniqueid] || id),
      uniqueid: uniqueid,
      updated: updated,
    };
  }

  if (bridge.excludes.indexOf(uniqueid) !== -1) {
    return resolve();
  }

  if (!sensors.hasOwnProperty(sensor.type)) {
    return resolve();
  }

  return sensors[sensor.type](bridge.sensors[uniqueid], sensor).catch(reject).then(resolve);
});

module.exports = (bridge) => {
  return request(bridge, 'sensors')
    .then((data) => new Promise((resolve) => {
      const promises = [];

      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          promises.push(parseSensor(bridge, data[key], key));
        }
      }

      return Promise.all(promises).then(resolve(bridge));
    }))
  ;
};
