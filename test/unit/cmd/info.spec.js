#! /usr/bin/env node
var CmdPromptAdapter = require('../../../src/adapters/cmd-prompt-adapter');
var InquireTestAdapter = require('../../../src/adapters/inquirer-test-adapter');
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var ApiTestAdapter = require('../../../src/adapters/api-test-adapter');
var CmdInfo = require('../../../src/cmd/info');
var program = require('commander');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Printer = require('../../../src/lib/printer')
var colors = require('colors');
const Table = require('cli-table')
const capitalize = require('capitalize')

describe('cmd-info', function () {

    var printer = new Printer()
    var cmdPromptAdapter = new CmdPromptAdapter(new InquireTestAdapter());
    var response = {
        event: 'haystack-change',
        data: {
            identifier: 'test',
            services: [
                {
                    name: 'web_1',
                    status: 'running',
                    exists: true,
                    is_running: true,
                    is_provisioned: false,
                    is_healthy: false
                },
                {
                    name: 'web_2',
                    status: 'running',
                    exists: true,
                    is_running: true,
                    is_provisioned: false,
                    is_healthy: false
                }
            ],
            status: 'running',
            health: 'healthy',
            terminated_on: null
        }
    }

    it('should return Yes with true when using the boolToString method', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdInfo = new CmdInfo(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        expect(cmdInfo.boolToString(true)).to.equal('Yes')
    })

    it('should return No with false when using the boolToString method', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdInfo = new CmdInfo(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        expect(cmdInfo.boolToString(false)).to.equal('No')
    })

    it('should have the current path as the identifier without an identifier option passed', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdInfo = new CmdInfo(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        expect(cmdInfo.parseOptions({})).to.deep.equal({ identifier: process.cwd() })

    })

    it('should have the identifier passed as the identifier option', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdInfo = new CmdInfo(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        expect(cmdInfo.parseOptions({ identifier: 'my-id' })).to.deep.equal({ identifier: 'my-id' })

    })

    it('should request and receive data correctly', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdInfo = new CmdInfo(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        expect(cmdInfo.getInfo({ identifier: '/path/to/my/id' })).to.eventually.equal(response)

    })

    it('should print the info data', function () {

        var messages = []
        printer = new Printer(function (message) {
            messages.push(message)
        })

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdInfo = new CmdInfo(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        var expected = []

        // title
        expected.push(colors.underline('Stack information'))

        var table = new Table({
            chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
                , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
                , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
                , 'right': '' , 'right-mid': '' , 'middle': ' ' },
            style: { 'padding-left': 0, 'padding-right': 0 }
        });

        // identifier
        table.push(['Identifier:', response.data.identifier])
        // status
        table.push(['Status:', capitalize(response.data.status)])
        // health
        table.push(['Health:', capitalize(response.data.health)])
        // services
        table.push(['Services:', response.data.services.length])

        expected.push(table.toString())

        // single services
        response.data.services.forEach(function (service, key) {
            expected.push(service.name + ' service:')

            table = new Table({
                chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
                    , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
                    , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
                    , 'right': '' , 'right-mid': '' , 'middle': ' ' },
                style: { 'padding-left': 1, 'padding-right': 0 }
            });

            table.push(['', 'Status:', capitalize(service.status)])
            table.push(['', 'Exists:', cmdInfo.boolToString(service.exists)])
            table.push(['', 'Running:', cmdInfo.boolToString(service.is_running)])
            table.push(['', 'Provisioned:', cmdInfo.boolToString(service.is_provisioned)])
            table.push(['', 'Healthy:', cmdInfo.boolToString(service.is_healthy)])

            expected.push(table.toString())
        })

        cmdInfo.printInfo(response)

        expect(messages).to.deep.equal(expected)

    })

})