#! /usr/bin/env node

'use stict';

const config = require('./lib/config');
const mqtt = require('./lib/mqtt');
const output = require('./lib/output');
const loop = require('./lib/loop');

config.parse(require('./config.json'));

if (undefined === config.bridges || !config.bridges.length) {
  if (config.verbose) {
    output.error('No bridges configured. Please configure at least one bridge and try again.');
  }

  process.exit(1);
}

if (!config.broker.connected) {
  mqtt.connect(config.broker);
}

config.bridges.forEach((bridge) => {
  if (!bridge || typeof(bridge.host) === 'undefined' || !bridge.host) {
    output.error('Missing required argument "host"');
    process.exit(1);
  }

  output.log('Polling bridge "%s" every %dms', bridge.host, bridge.interval);

  loop(bridge);
});

if (process.argv.indexOf('--send-ready') !== -1 && process.ppid) {
  process.send('ready');
}
