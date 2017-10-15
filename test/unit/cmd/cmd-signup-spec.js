#! /usr/bin/env node
var CmdPromptAdapter = require('../../../src/adapters/cmd-prompt-adapter');
var InquireTestAdapter = require('../../../src/adapters/inquirer-test-adapter');
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var ApiTestAdapter = require('../../../src/adapters/api-test-adapter');
var CmdSignUp = require('../../../src/cmd/signup');
var program = require('commander');
var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var sinon = require('sinon');


describe('cmd-signup', function() {

    var cmdPromptAdapter = new CmdPromptAdapter(new InquireTestAdapter());




    it("should provide a success message if email does not exist", function(){

        var apiAdapter = new ApiTestAdapter({
            uri: 'test',
            response: [] //response containing no match
        });

        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);

        var cmdSignUp = new CmdSignUp(program, hayStackServiceAdapter, cmdPromptAdapter);

        var options = {
            email: "test@test.com",
            password: "123456"
        }

        return expect(cmdSignUp.do(options)).to.eventually.equal("Your account has been created!");


    });

    it("should provide an error if the email already exists as an account", function(){

        var apiAdapter = new ApiTestAdapter({
            uri: 'test',
            response: [{email:'test@test.com'}] //response containing a match
        });

        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);

        var cmdSignUp = new CmdSignUp(program, hayStackServiceAdapter, cmdPromptAdapter);

        var options = {
            email: "test@test.com",
            password: "123456"
        }

        return expect(cmdSignUp.do(options)).to.be.rejectedWith({message: 'An account exists for the email you provided.'});


    });

    it("should provide an error if the api errors", function(){

        var apiAdapter = new ApiTestAdapter({
            uri: 'test',
            error: "Some api error" //response containing a match
        });

        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);

        var cmdSignUp = new CmdSignUp(program, hayStackServiceAdapter, cmdPromptAdapter);

        var options = {
            email: "test@test.com",
            password: "123456"
        }

        return expect(cmdSignUp.do(options)).to.be.rejectedWith({message: 'An account exists for the email you provided.'});


    });

});