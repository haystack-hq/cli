#! /usr/bin/env node
var CmdPromptAdapter = require('../../../src/adapters/cmd-prompt-adapter');
var InquireTestAdapter = require('../inquirer-test-adapter');
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var ApiTestAdapter = require('../api-test-adapter');
var CmdSsh = require('../../../src/cmd/ssh');
var program = require('commander');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Table = require('cli-table2')
var colors = require('colors')
var Printer = require('../../../src/lib/printer')

describe('cmd-ssh', function () {

    var printer = new Printer()
    var cmdPromptAdapter = new CmdPromptAdapter(new InquireTestAdapter());
    var response = {
        cmd: 'docker exec -it abc_web_1 /bin/sh'
    }

    it('should return all options when identifier passed', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: {}
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdSsh = new CmdSsh(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        var options = {
            service: 'web_1',
            identifier: 'abc'
        }

        var expected = {
            identifier: 'abc',
            service: 'web_1',
            new_terminal: false
        }

        expect(cmdSsh.parseOptions(options)).to.eventually.deep.equal(expected)

    })

    it('should return all options when no identifier passed', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: [{
                identifier: 'abc'
            }]
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdSsh = new CmdSsh(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        var options = {
            service: 'web_1'
        }

        var expected = {
            identifier: 'abc',
            service: 'web_1',
            new_terminal: false
        }

        expect(cmdSsh.parseOptions(options)).to.eventually.deep.equal(expected)

    })

    it('should receive command to run', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdSsh = new CmdSsh(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        var options = {
            identifier: 'abc',
            service: 'web_1',
            new_terminal: false
        }

        expect(cmdSsh.do(options)).to.eventually.equal(response)

    })

})