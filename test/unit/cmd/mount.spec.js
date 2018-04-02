#! /usr/bin/env node
var CmdPromptAdapter = require('../../../src/adapters/cmd-prompt-adapter');
var InquireTestAdapter = require('../inquirer-test-adapter');
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var ApiTestAdapter = require('../api-test-adapter');
var CmdMount = require('../../../src/cmd/mount');
var program = require('commander');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var colors = require('colors')
var Printer = require('../../../src/lib/printer')

describe('cmd-mount', function () {

    var cmdPromptAdapter = new CmdPromptAdapter(new InquireTestAdapter());
    var response = {
        message: 'The stack is mounting.'
    }

    it('should parse options with services and identifier', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: []
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdMount = new CmdMount(program, hayStackServiceAdapter, cmdPromptAdapter);

        var options = {
            identifier: 'test',
            services: ['one', 'two'],
            directory: '/path/to/mount'
        }

        expect(cmdMount.parseOptions(options)).to.eventually.deep.equal(options)
    })

    it('should send mount request and receive message back', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdMount = new CmdMount(program, hayStackServiceAdapter, cmdPromptAdapter);

        var options = {
            identifier: 'test',
            services: ['one', 'two']
        }

        expect(cmdMount.do(options)).to.eventually.equal(response)
    })

    it('should send mount request and receive message back', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            error: 'error'
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdMount = new CmdMount(program, hayStackServiceAdapter, cmdPromptAdapter);

        var options = {
            identifier: 'test',
            services: ['one', 'two']
        }

        expect(cmdMount.do(options)).to.be.rejected
    })

})