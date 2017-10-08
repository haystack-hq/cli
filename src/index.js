#! /usr/bin/env node
const fs = require('fs');
var path = require('path');
var Preferences = require("preferences");
var program = require('commander');


/* regisgter commands */
const cmdFolder =__dirname + '/cmd';
fs.readdirSync(cmdFolder).forEach(function(file) {

   var cmd = require(cmdFolder + "/" + file);
   var c = new cmd(program);
});


program.parse(process.argv);


