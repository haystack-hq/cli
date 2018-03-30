#! /usr/bin/env node
var Promise = require('bluebird');
var User = require('../lib/user');
var Validator = require('../lib/validator');


var CmdSignup = function(program, hayStackServiceAdapter, cmdPromptAdapter){

    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.validator = new Validator();


    program
        .command('signup')
        .description('Signup to HayStack')
        .option("-e --email  [value]", "Email")
        .option("-u --username  [value]", "Username")
        .option("-p --password  [value]", "Password")
        .action(
            function( cmd ){
                self.action(cmd);
            });
}

CmdSignup.prototype.action = function(cmd) {
    this.do(cmd)
        .then(function (result) {
            console.log(result);
        })
        .catch(function(err){ console.log(err)});
}

CmdSignup.prototype.do = function(options) {
    var self = this;

    return new Promise(function(resolve, reject) {


        //placeholder for the user that we are trying to create
        var user = new User();

        //default to arguments when available
        user.email = options.email;
        user.password = options.password;




        //begin asking questions.
        self.cmdPromptAdapter.ask(
            {
                questions: [
                    {
                        type: 'input',
                        validate: self.validator.required,
                        name: 'email',
                        message: 'Email:'
                    }
                ],
                args: {email: options.email}
            }
            )
            .then(
                function (answers) {
                    user.email = answers.email
                    return self.accountExists(user.email);
                }
            ).then(
            function (result){
                return self.cmdPromptAdapter.ask(
                    {
                        questions: [
                            {
                                type: 'input',
                                validate: self.validator.required,
                                name: 'username',
                                message: 'Username:'
                            }
                        ],
                        args: {username: options.username}
                    }
                )
            }

        ).then(
            function (answers) {
                user.username = answers.username
                return self.usernameExists(user.username);
            }
            )
            .then(
                function () {

                    return self.cmdPromptAdapter.ask(
                        {
                            questions: [
                                {
                                    type: 'password',
                                    validate: self.validator.required,
                                    name: 'password',
                                    message: 'Password:'
                                }
                            ],
                            args: {password: options.password}
                        });
                }
            )
            .then(
                function (answers) {

                    user.password = answers.password;
                    return self.createAccount(user)
                }
            ).then(
            function(account){
                resolve("Your account has been created!");
            }
            )
            .catch(
                function (err) {
                    reject(err);
                }
            );
    });

}



CmdSignup.prototype.accountExists = function(email) {

    var self = this;

    return new Promise(function(resolve, reject){

        self.hayStackServiceAdapter.get("user", {email: email})
            .then(
                function(result) {
                    //if there re results, error

                    if(result.length == 0) {
                        resolve(true)
                    } else {
                        reject({message: "An account exists for the email you provided."});
                    }
                }
            )
            .catch(
                function(err){ reject(err) }
            );

    });
}


CmdSignup.prototype.usernameExists = function(username) {

    var self = this;

    return new Promise(function(resolve, reject){

        self.hayStackServiceAdapter.get("user", {username: username})
            .then(
                function(result) {
                    //if there re results, error

                    if(result.length == 0) {
                        resolve(true)
                    } else {
                        reject({message: "That username is already in use."});
                    }
                }
            )
            .catch(
                function(err){ reject(err) }
            );

    });
}

CmdSignup.prototype.createAccount = function(user) {
    return new Promise(function(resolve, reject){
        //console.log("creating account", user);
        resolve({});
    });
}






module.exports = CmdSignup;