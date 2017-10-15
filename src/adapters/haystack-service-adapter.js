#! /usr/bin/env node
var Promise = require("bluebird");



var HayStackServiceAdapter = function(apiAdapter){
	if(!apiAdapter){
        throw new Error("Missing api adapter on construct");
	}
	else
	{
		if(!apiAdapter.options.uri){
            throw new Error("Api adapter missing 'uri' option.");
		}
	}
	this.apiAdapter = apiAdapter;
}

HayStackServiceAdapter.prototype.create = function(object, data){
	return this.apiAdapter.request(this.headers, this.endpoint(object), 'create', data);
}


HayStackServiceAdapter.prototype.get = function(object, data){
    return this.apiAdapter.request(this.headers, this.endpoint(object), 'get', data);
}


HayStackServiceAdapter.prototype.update = function(object, data){
    return this.apiAdapter.request(this.headers, this.endpoint(object), 'update', data);
}

HayStackServiceAdapter.prototype.delete = function(object, data){
    return this.apiAdapter.request(this.headers, this.endpoint(object), 'delete', data);
}

//todo: convert endpoint from object to api friendly enpoint.
HayStackServiceAdapter.prototype.endpoint = function(object){
	return object;
}

module.exports = HayStackServiceAdapter;