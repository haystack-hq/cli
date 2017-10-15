#! /usr/bin/env node
var Promise = require("bluebird");

var InquirerTestAdapter = function(){

}

InquirerTestAdapter.prototype.prompt = function(questions){
    return new Promise(function(resolve, reject){
        resolve(questions);
    });
}




module.exports = InquirerTestAdapter;