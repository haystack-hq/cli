#! /usr/bin/env node
var path = require('path');

var config = module.exports = {};

var configFile = require(path.join(process.env.HOME, '/.haystack/config.json'))

config.env = 'production';
config.debug_mode = 'off';
config.daemon_port = configFile.AGENT_PORT ? configFile.AGENT_PORT : 3000

// Haystack Agent
config.haystack_daemon_enpoint = 'http://127.0.0.1:' + config.daemon_port;

// Websocket
config.haystack_websocket_endpoint = 'ws://127.0.0.1' + config.daemon_port +'/stacks/stream'