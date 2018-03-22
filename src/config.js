#! /usr/bin/env node

var config = module.exports = {};

var configFile = require(process.env.HOME + '/.haystack/config.json')

config.env = 'production';
config.debug_mode = 'off';
config.daemon_port = configFile.daemon_port ? configFile.daemon_port : 3000

// Haystack Agent
config.haystack_agent_enpoint = 'http://127.0.0.1:' + config.daemon_port;

// Websocket
config.haystack_websocket_endpoint = 'ws://127.0.0.1' + config.daemon_port +'/stacks/stream'