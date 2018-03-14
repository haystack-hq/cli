#! /usr/bin/env node
const fs = require('fs');
var path = require('path');
var Preferences = require("preferences");
var program = require('commander');
var inquirer = require('inquirer');
var HayStackServiceAdapter = require('./adapters/haystack-service-adapter');
var ApiAdapter = require('./adapters/api-test-adapter'); //todo: swap this out with the real adapter.
var CmdPromptAdapter = require('./adapters/cmd-prompt-adapter');
var config = require('./config.js');

/* define api options */
var apiOptions = { uri: config.haystack_api_enpoint, response: [] }


/* setup the adapters */
var apiAdapter = new ApiAdapter(apiOptions);
var apiServiceAdapter = new HayStackServiceAdapter(apiAdapter);
var cmdPromptAdapter = new CmdPromptAdapter(inquirer);

/* register commands */
const cmdFolder =__dirname + '/cmd';
fs.readdirSync(cmdFolder).forEach(function(file) {
    var cmd = require(cmdFolder + "/" + file);
    var c = new cmd(program, apiServiceAdapter, cmdPromptAdapter);
});


program.parse(process.argv);



