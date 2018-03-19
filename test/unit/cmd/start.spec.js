#! /usr/bin/env node
var CmdPromptAdapter = require('../../../src/adapters/cmd-prompt-adapter');
var InquireTestAdapter = require('../../../src/adapters/inquirer-test-adapter');
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var ApiTestAdapter = require('../../../src/adapters/api-test-adapter');
var CmdStart = require('../../../src/cmd/start');
var program = require('commander');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const WebSocket = require('ws');
var Printer = require('../../../src/lib/printer')
var colors = require('colors');

describe('cmd-start', function () {

    var printer = new Printer()
    var cmdPromptAdapter = new CmdPromptAdapter(new InquireTestAdapter());
    var response = {
        "identifier": "test",
        "services": [
            {
                "name": "web_1",
                "status": "initializing",
                "error": null
            },
            {
                "name": "web_2",
                "status": "initializing",
                "error": null
            }
        ],
        "stack_file_encoded": "ew0KICAidmFyaWFibGVzIjogWw0KICAgIHsNCiAgICAgICJrZXkiOiAidmFsdWUiDQogICAgfSwNCiAgICB7DQogICAgICAia2V5IjogeyAiY2hpbGRrZXkiOiAiY2hpbGR2YWx1ZSIgfQ0KICAgIH0NCiAgXSwNCg0KICAicmVzb3VyY2VzIjogew0KICAgICJ3ZWJfMSI6IHsNCiAgICAgICJ0eXBlIjogImRvY2tlci5pbWFnZSIsDQogICAgICAiaW1hZ2UiOiAiaGVsbG8td29ybGQiDQogICAgfSwNCg0KICAgICJ3ZWJfMiI6IHsNCiAgICAgICJ0eXBlIjogImRvY2tlci5idWlsZCIsDQogICAgICAic3JjIjogIi4iDQogICAgfQ0KICB9DQp9",
        "build_encoded": "ew0KICAiaWRlbnRpZmllciI6ICJ0ZXN0LXN0YWNrIiwNCiAgIm9iamVjdHMiOiB7DQogICAgImJ1aWxkcyI6IFsNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInRlc3QtYnVpbGQtaW1hZ2UiLA0KICAgICAgICAidGFnIjogInRlc3Qtd2l0aC1jdXN0b20taW1hZ2UiDQogICAgICB9DQogICAgXSwNCiAgICAiaW1hZ2VzIjogWw0KICAgICAgew0KICAgICAgICAibmFtZSI6ICJ0dXR1bS9oZWxsby13b3JsZCINCiAgICAgIH0NCiAgICBdLA0KICAgICJjb250YWluZXJzIjogWw0KICAgICAgew0KICAgICAgICAiaW1hZ2UiOiAidHV0dW0vaGVsbG8td29ybGQiLA0KICAgICAgICAibmFtZSI6ICJ3ZWJfMSIsDQogICAgICAgICJkZXRhY2giOiB0cnVlLA0KICAgICAgICAicG9ydHMiOiBbDQogICAgICAgICAgew0KICAgICAgICAgICAgImNvbnRhaW5lciI6ICI4MCIsDQogICAgICAgICAgICAiaG9zdCI6ICI0NDU0Ig0KICAgICAgICAgIH0NCiAgICAgICAgXQ0KICAgICAgfSwNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInR1dHVtL2hlbGxvLXdvcmxkIiwNCiAgICAgICAgIm5hbWUiOiAid2ViXzIiLA0KICAgICAgICAiZGV0YWNoIjogdHJ1ZSwNCiAgICAgICAgInBvcnRzIjogWw0KICAgICAgICAgIHsNCiAgICAgICAgICAgICJjb250YWluZXIiOiAiODAiLA0KICAgICAgICAgICAgImhvc3QiOiAiNDQ1NSINCiAgICAgICAgICB9DQogICAgICAgIF0NCiAgICAgIH0NCiAgICBdLA0KICAgICJuZXR3b3JrcyI6IFtdDQogIH0NCn0NCg0KDQo",
        "mode": "local",
        "provider": "local",
        "cloud_stack_id": null,
        "stack_file_location": "/full/path/to/my/project/stack/file",
        "status": "starting",
        "health": "healthy"
    }
    var websocketConfig = { uri: 'ws://127.0.0.1:3111/stacks/stream' }

    it('should err trying to start the stack', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            error: 'The stack could not be launched.'
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdStart = new CmdStart(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig);

        expect(cmdStart.do({})).to.be.rejectedWith('The stack could not be launched.')

    })


    it('should have current folder and mount true by default for request', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdStart = new CmdStart(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig);

        expect(cmdStart.parseOptions({})).to.contain({
            directory: process.cwd(),
            mount: true
        })

    })


    it('should have specific identifier for request', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdStart = new CmdStart(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig);

        var options = {
            identifier: 'my-identifier'
        }

        expect(cmdStart.parseOptions(options)).to.contain({identifier: 'my-identifier'})

    })


    it('should have mount as false for request', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdStart = new CmdStart(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig);

        var options = {
            excludeMount: true
        }

        expect(cmdStart.parseOptions(options)).to.contain({mount: false})

    })

    it('should get stack as response', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdStart = new CmdStart(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig);

        expect(cmdStart.do({})).to.eventually.equal(response)

    })

    it('it should print feedback messages', function (done) {

        const wss = new WebSocket.Server({ port: 3111 });

        var response1 = {
            event: 'haystack-change',
            data: {
                identifier: 'test',
                services: [
                    {
                        name: 'web_1',
                        status: 'provisioning',
                        exists: true,
                        is_running: true,
                        is_provisioned: false,
                        is_healthy: false
                    },
                    {
                        name: 'web_2',
                        status: 'provisioning',
                        exists: true,
                        is_running: true,
                        is_provisioned: false,
                        is_healthy: false
                    }
                ],
                status: 'provisioning',
                health: 'unhealthy',
                terminated_on: null
            }
        }

        var response2 = {
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
                        status: 'provisioning',
                        exists: true,
                        is_running: true,
                        is_provisioned: false,
                        is_healthy: false
                    }
                ],
                status: 'provisioning',
                health: 'unhealthy',
                terminated_on: null
            }
        }

        var response3 = {
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

        wss.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
            });

            ws.send(JSON.stringify(response1));
            ws.send(JSON.stringify(response2));
            ws.send(JSON.stringify(response3));
        });

        var messages = []

        printer = new Printer(function (message) {
            messages.push(message)
        })

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdStart = new CmdStart(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig);


        var expected = [
            colors.green('test stack is starting...'),
            'web_1 service is provisioning',
            'web_2 service is provisioning',
            colors.yellow('test stack is provisioning...'),
            'web_1 service is running',
            'web_2 service is running',
            colors.green('test stack is running!')
        ]

        cmdStart.websocketListeningAndConsoleMessaging(response)
            .then(function () {
                expect(messages).to.deep.equal(expected)

                done()
                wss.close()
            })
            .catch(function () {console.log(colors.red('the expect failed'))})



    })

})