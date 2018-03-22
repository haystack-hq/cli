#! /usr/bin/env node

require('dotenv').config({path: process.env.HOME + '/.haystack/config'})
var config = module.exports = {};

config.env = 'production';
config.debug_mode = 'off';
config.port = process.env.AGENT_PORT ? process.env.AGENT_PORT : 3000

// Haystack Agent
config.haystack_agent_enpoint = 'http://127.0.0.1:' + config.port;

// Websocket
config.haystack_websocket_endpoint = 'ws://127.0.0.1' + config.port +'/stacks/stream'