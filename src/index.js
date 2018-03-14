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
var apiOptions = { uri: config.haystack_api_enpoint, response: {
        "identifier": "test",
        "services": [
            {
                "name": "web_1",
                "status": "initializing",
                "error": null
            },
            {
                "name": "web_2",
                "status": "initializing",
                "error": null
            }
        ],
        "stack_file_encoded": "ew0KICAidmFyaWFibGVzIjogWw0KICAgIHsNCiAgICAgICJrZXkiOiAidmFsdWUiDQogICAgfSwNCiAgICB7DQogICAgICAia2V5IjogeyAiY2hpbGRrZXkiOiAiY2hpbGR2YWx1ZSIgfQ0KICAgIH0NCiAgXSwNCg0KICAicmVzb3VyY2VzIjogew0KICAgICJ3ZWJfMSI6IHsNCiAgICAgICJ0eXBlIjogImRvY2tlci5pbWFnZSIsDQogICAgICAiaW1hZ2UiOiAiaGVsbG8td29ybGQiDQogICAgfSwNCg0KICAgICJ3ZWJfMiI6IHsNCiAgICAgICJ0eXBlIjogImRvY2tlci5idWlsZCIsDQogICAgICAic3JjIjogIi4iDQogICAgfQ0KICB9DQp9",
        "build_encoded": "ew0KICAiaWRlbnRpZmllciI6ICJ0ZXN0LXN0YWNrIiwNCiAgIm9iamVjdHMiOiB7DQogICAgImJ1aWxkcyI6IFsNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInRlc3QtYnVpbGQtaW1hZ2UiLA0KICAgICAgICAidGFnIjogInRlc3Qtd2l0aC1jdXN0b20taW1hZ2UiDQogICAgICB9DQogICAgXSwNCiAgICAiaW1hZ2VzIjogWw0KICAgICAgew0KICAgICAgICAibmFtZSI6ICJ0dXR1bS9oZWxsby13b3JsZCINCiAgICAgIH0NCiAgICBdLA0KICAgICJjb250YWluZXJzIjogWw0KICAgICAgew0KICAgICAgICAiaW1hZ2UiOiAidHV0dW0vaGVsbG8td29ybGQiLA0KICAgICAgICAibmFtZSI6ICJ3ZWJfMSIsDQogICAgICAgICJkZXRhY2giOiB0cnVlLA0KICAgICAgICAicG9ydHMiOiBbDQogICAgICAgICAgew0KICAgICAgICAgICAgImNvbnRhaW5lciI6ICI4MCIsDQogICAgICAgICAgICAiaG9zdCI6ICI0NDU0Ig0KICAgICAgICAgIH0NCiAgICAgICAgXQ0KICAgICAgfSwNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInR1dHVtL2hlbGxvLXdvcmxkIiwNCiAgICAgICAgIm5hbWUiOiAid2ViXzIiLA0KICAgICAgICAiZGV0YWNoIjogdHJ1ZSwNCiAgICAgICAgInBvcnRzIjogWw0KICAgICAgICAgIHsNCiAgICAgICAgICAgICJjb250YWluZXIiOiAiODAiLA0KICAgICAgICAgICAgImhvc3QiOiAiNDQ1NSINCiAgICAgICAgICB9DQogICAgICAgIF0NCiAgICAgIH0NCiAgICBdLA0KICAgICJuZXR3b3JrcyI6IFtdDQogIH0NCn0NCg0KDQo",
        "mode": "local",
        "provider": "local",
        "cloud_stack_id": null,
        "stack_file_location": "/full/path/to/my/project/stack/file",
        "status": "starting",
        "health": "healthy"
    }
};


/* setup the adapters */
var apiAdapter = new ApiAdapter(apiOptions);
var apiServiceAdapter = new HayStackServiceAdapter(apiAdapter);
var cmdPromptAdapter = new CmdPromptAdapter(inquirer);

/* regisgter commands */
const cmdFolder =__dirname + '/cmd';
fs.readdirSync(cmdFolder).forEach(function(file) {
    var cmd = require(cmdFolder + "/" + file);
    var c = new cmd(program, apiServiceAdapter, cmdPromptAdapter);
});


program.parse(process.argv);



