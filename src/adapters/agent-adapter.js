#! /usr/bin/env node
var Promise = require("bluebird");
var axios = require('axios')

var AgentAdapter = function(options){
    this.options = options;

    if(!this.options.uri){
        throw new Error("Agent adapter missing 'uri' option.");
    }
}

AgentAdapter.prototype.request = function(headers, endpoint, method, payload){
    var self = this;

    var axiosInstance = axios.create({
        baseURL: self.options.uri
    })

    return new Promise(function (resolve, reject) {
        axiosInstance[method](endpoint, payload)
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

module.exports = AgentAdapter;
