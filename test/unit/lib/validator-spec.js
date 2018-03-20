#! /usr/bin/env node
var Validator = require('../../../src/lib/validator');
var assert = require('assert');
var sinon = require('sinon');

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


describe('validator-required', function() {

    var validator = new Validator();


    it("should return true if a value is provided", function () {
        assert(validator.required('test') === true);
    });

    it("should return a message if a value is not provided", function () {
        assert(validator.required('') === 'required');
    });


});