#! /usr/bin/env node
var CmdPromptAdapter = require('../../../src/adapters/cmd-prompt-adapter');
var InquireTestAdapter = require('../inquirer-test-adapter');
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var ApiTestAdapter = require('../api-test-adapter');
var CmdUnmount = require('../../../src/cmd/unmount');
var program = require('commander');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var colors = require('colors')
var Printer = require('../../../src/lib/printer')

describe('cmd-unmount', function () {

    var cmdPromptAdapter = new CmdPromptAdapter(new InquireTestAdapter());
    var response = {
        message: 'The stack is unmounting.'
    }

    it('should parse options with services and identifier', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: []
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdUnmount = new CmdUnmount(program, hayStackServiceAdapter, cmdPromptAdapter);

        var options = {
            identifier: 'test',
            services: ['one', 'two']
        }

        expect(cmdUnmount.parseOptions(options)).to.eventually.deep.equal(options)
    })

    it('should send mount request and receive message back', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdUnmount = new CmdUnmount(program, hayStackServiceAdapter, cmdPromptAdapter);

        var options = {
            identifier: 'test',
            services: ['one', 'two']
        }

        expect(cmdUnmount.do(options)).to.eventually.equal(response)
    })

    it('should send mount request and receive message back', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            error: 'error'
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdUnmount = new CmdUnmount(program, hayStackServiceAdapter, cmdPromptAdapter);

        var options = {
            identifier: 'test',
            services: ['one', 'two']
        }

        expect(cmdUnmount.do(options)).to.be.rejected
    })

})