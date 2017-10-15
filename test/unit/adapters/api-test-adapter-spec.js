#! /usr/bin/env node

var ApiTestAdapter = require('../../../src/adapters/api-test-adapter');
var assert = require('assert');
var sinon = require('sinon');

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


describe('api-test-adapter', function() {

    it("should reject if an error is passed in options", function(){
        var options = {
            error: "testerror"
        }

        var apiTestAdapter = new ApiTestAdapter(options);

        return expect(apiTestAdapter.request()).to.be.rejected;
    });


    it("should return a valid response when the response is provided", function(){
        var response =  [{test: true}];
        var options = {
            response: response
        }

        var apiTestAdapter = new ApiTestAdapter(options);

        return expect(apiTestAdapter.request()).to.eventually.equal(response);
    });


    it("should return null object when the response is not provided", function(){

        var options = {} //do not provide anything in the reponse.

        var apiTestAdapter = new ApiTestAdapter(options);

        return expect(apiTestAdapter.request()).to.eventually.equal(null);
    });





});

