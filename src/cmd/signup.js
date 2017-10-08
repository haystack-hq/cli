#! /usr/bin/env node
var inquirer = require('inquirer');
var Promise = require('bluebird');


var CmdSignup = function(program){
  var self = this;

  program
       .command('signup')
       .description('Signup to HayStack')
       .option("-e --email  [value]", "Email")
       .option("-u --username  [value]", "Username")
       .option("-p --password  [value]", "Password")
       .action(function( cmd, options){
           self.do(cmd);
  });

}

CmdSignup.prototype.do = function(options) {
	
	//get the username and validate that the username is unique.

	this.promptUsername().then(function(answers){

	});



}


CmdSignup.prototype.promptUsername = function(options) {
	
	//get the username and validate that the username is unique.

	var questions = [
       {
           type: 'input',
           name: 'username',
           message: 'Please enter a unique username:'
       }
   	];

   return inquirer.prompt(questions);

}


CmdSignup.prototype.promptEmail = function(options) {
	
	//get the username and validate that the username is unique.

	var questions = [
       {
           type: 'input',
           name: 'email',
           //default: userData.email,
           message: 'Email:'
       }
   	];

   return inquirer.prompt(questions);

}

CmdSignup.prototype.promptPassword = function(options) {
	
	//get the username and validate that the username is unique.

	var questions = [
       {
           type: 'password',
           name: 'password',
           //default: userData.email,
           message: 'Password:'
       }
   	];

   return inquirer.prompt(questions);

}

CmdSignup.prototype.promptPasswordRepeat = function(options) {
	
	//get the username and validate that the username is unique.

	var questions = [
       {
           type: 'password',
           name: 'password_repeat',
           //default: userData.email,
           message: 'Repeat Password:'
       }
   	];

   return inquirer.prompt(questions);

}




module.exports = CmdSignup