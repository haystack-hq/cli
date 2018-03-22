#! /usr/bin/env node

require('dotenv').config({path: '~/.haystack/config'})
var config = module.exports = {};

config.env = 'production';
config.debug_mode = 'off';

//HayStack Api
config.haystack_api_enpoint = 'http://127.0.0.1:' + (process.env.AGENT_PORT ? process.env.AGENT_PORT : 3000);

// Websocket
config.haystack_websocket_endpoint = 'ws://127.0.0.1:3000/stacks/stream'