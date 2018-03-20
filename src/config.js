#! /usr/bin/env node

var config = module.exports = {};

config.env = 'production';
config.debug_mode = 'off';

//HayStack Api
config.haystack_api_enpoint = 'http://127.0.0.1:3000';

// Websocket
config.haystack_websocket_endpoint = 'ws://127.0.0.1:3000/stacks/stream'