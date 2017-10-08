#! /usr/bin/env node
var Promise = require("bluebird");

var config = require('../config.js');

var HayStackServiceAdapter = function(){
	this.endpoint = config.haystack_api_enpoint;
}

HayStackServiceAdapter.prototype.create = function(object, data){
	return new Promise(function(resolve, reject){
		resolve({});
	});
}


module.exports = HayStackServiceAdapter;