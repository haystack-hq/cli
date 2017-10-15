#! /usr/bin/env node

var ValidatorAdapter = function(){

}

ValidatorAdapter.prototype.required = function(val, options) {
    var message = "required";

    return val.length > 0 ? true : message;
}

module.exports = ValidatorAdapter;