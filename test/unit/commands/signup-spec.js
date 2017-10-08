var cmdSignup = require('../../../src/cmd/signup');
var assert = require('assert');
var randomstring = require("randomstring");
var sleep = require('sleep');
var testPrompt = require('inquirer-test');




describe('signup', function() {

	var stdin;
  	beforeEach(function () {
    	stdin = require('mock-stdin').stdin();
  	});

    it('prompt for username', function() {
      	
      	//stub data
    	var username = "test"


    	//test begins
      	var signup = new cmdSignup();


      	process.nextTick(function mockResponse() {
	      stdin.send(username + '\n');
	    });
      	
      	return signup.promptUsername().then(function(answers){
      		console.assert(answers.username === username, "Username was received correctly");
      	});
      	

    });



    it('prompt for email', function() {
      	
      	//stub data
    	var email = "test@test.com"


    	//test begins
      	var signup = new cmdSignup();


      	process.nextTick(function mockResponse() {
	      stdin.send(email + '\n');
	    });
      	
      	return signup.promptEmail().then(function(answers){
      		console.assert(answers.email === email, "Email was received correctly");
      	});
      	

    });



    it('prompt for password', function() {
      	
      	//stub data
    	var password = "password"


    	//test begins
      	var signup = new cmdSignup();


      	process.nextTick(function mockResponse() {
	      stdin.send(password + '\n');
	    });
      	
      	return signup.promptPassword().then(function(answers){
      		console.assert(answers.password === password, "Password was received correctly");
      	});
      	

    });


    it('prompt for password again', function() {
      	
      	//stub data
    	var password = "password"


    	//test begins
      	var signup = new cmdSignup();


      	process.nextTick(function mockResponse() {
	      stdin.send(password + '\n');
	    });
      	
      	return signup.promptPasswordRepeat().then(function(answers){
      		console.assert(answers.password_repeat === password, "Repeat password was received correctly");
      	});
      	

    });



});

