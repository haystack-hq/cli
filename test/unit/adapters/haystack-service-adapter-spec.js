#! /usr/bin/env node
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var ApiTestAdapter = require('../../../src/adapters/api-test-adapter');
var assert = require('assert');
var sinon = require('sinon');

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


describe('haystack-service-adapter', function() {

    it('should fail if no apiAdapter is provided on construct', function() {
        chai.expect(HayStackServiceAdapter).to.throw(Error);
    });

    it('should fail if no apiAdapter.uri is provided on construct', function() {
        var apiAdapter = new ApiTestAdapter({});
        chai.expect(function(){
            HayStackServiceAdapter(apiAdapter)
        }).to.throw(Error);
    });

    it('should have methods get, create, update, delete', function() {

        var apiAdapter = new ApiTestAdapter({uri: 'test'});
        var haystackServiceAdapter = new HayStackServiceAdapter(apiAdapter);

        assert(typeof haystackServiceAdapter.get === "function", "get method exists");
        assert(typeof haystackServiceAdapter.post === "function", "create method exists");
        assert(typeof haystackServiceAdapter.put === "function", "update method exists");
        assert(typeof haystackServiceAdapter.patch === "function", "patch method exists");
        assert(typeof haystackServiceAdapter.delete === "function", "delete method exists");

    });


    it('should return promises for get, create, update, delete', function() {

        var apiAdapter = new ApiTestAdapter({uri: 'test'});
        var haystackServiceAdapter = new HayStackServiceAdapter(apiAdapter);

        expect(haystackServiceAdapter.get()).to.eventually.be.fulfilled;
        expect(haystackServiceAdapter.post()).to.eventually.be.fulfilled;
        expect(haystackServiceAdapter.put()).to.eventually.be.fulfilled;
        expect(haystackServiceAdapter.patch()).to.eventually.be.fulfilled;
        expect(haystackServiceAdapter.delete()).to.eventually.be.fulfilled;



    });

});

