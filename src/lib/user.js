#! /usr/bin/env node
var Promise = require("bluebird");

var User = function(options){
    this.options = options;
}

User.prototype.create = function(){

    var self = this;

    return new Promise(function(resolve, reject){
        var data = {email: this.email, username: this.username, password: this.password};
        self.options.apiAdapter.create("user", data).then(function(result){

            self.id = result.id;

            resolve(self);
        });
    });



}


module.exports = User;