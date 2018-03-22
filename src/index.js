#! /usr/bin/env node
const fs = require('fs');
var path = require('path');
var Preferences = require("preferences");
var program = require('commander');
var inquirer = require('inquirer');
var HayStackServiceAdapter = require('./adapters/haystack-service-adapter');
var AgentAdapter = require('./adapters/agent-adapter');
// var AgentAdapter = require('./adapters/api-test-adapter');
var CmdPromptAdapter = require('./adapters/cmd-prompt-adapter');
var config = require('./config.js');
var Printer = require('./lib/printer');

/* define api options */
var agentOptions = { uri: config.haystack_agent_enpoint }
// var agentOptions = { uri: config.haystack_api_enpoint, response: [] }
var websocketConfig = { uri: config.haystack_websocket_endpoint }


/* setup the adapters */
var apiAdapter = new AgentAdapter(agentOptions);
var apiServiceAdapter = new HayStackServiceAdapter(apiAdapter);
var cmdPromptAdapter = new CmdPromptAdapter(inquirer);
var printer = new Printer()

/* register commands */
const cmdFolder =__dirname + '/cmd';
fs.readdirSync(cmdFolder).forEach(function(file) {
    var cmd = require(cmdFolder + "/" + file);
    var c = new cmd(program, apiServiceAdapter, cmdPromptAdapter, printer, websocketConfig);
});


program.parse(process.argv);
