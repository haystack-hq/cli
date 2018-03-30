#! /usr/bin/env node
var Promise = require("bluebird");

var ApiTestAdapter = function(options){
    this.options = options;
}

ApiTestAdapter.prototype.request = function(headers, endpoint, method, payload){
    var self = this;
    return new Promise(function(resolve, reject){

        if(self.options.error){
            reject({message: self.options.error});
        }
        else
        {
            var response = (self.options.response ? self.options.response : null );
            resolve(response);
        }

    });
}




module.exports = ApiTestAdapter;