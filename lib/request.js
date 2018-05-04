'use strict';

const request = require('request-promise-native');
const sprintf = require('sprintf-js').sprintf;
const output = require('./output');

const req = (bridge, options) => {
  output.log('Call %s', options.uri);

  return request(options).catch(error => new Promise((resolve, reject) => {
    output.error('HTTP error %s', error.message);

    reject(bridge);
  }));
};

module.exports = (bridge, service) => {
  return req(bridge, {
    uri: sprintf('http://%s/%s/%s/%s', bridge.host, 'api', bridge.username, service),
    json: true,
    timeout: bridge.timeout
  });
};
