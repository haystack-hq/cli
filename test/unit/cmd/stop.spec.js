#! /usr/bin/env node
var CmdPromptAdapter = require('../../../src/adapters/cmd-prompt-adapter');
var InquireTestAdapter = require('../../../src/adapters/inquirer-test-adapter');
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var ApiTestAdapter = require('../../../src/adapters/api-test-adapter');
var CmdStop = require('../../../src/cmd/stop');
var program = require('commander');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const WebSocket = require('ws');
var Printer = require('../../../src/lib/printer')
var colors = require('colors');

describe('cmd-stop', function () {

    var printer = new Printer()
    var cmdPromptAdapter = new CmdPromptAdapter(new InquireTestAdapter());
    var response = {
        "identifier": "test",
        "services": [
            {
                "name": "web_1",
                "status": "running",
                "error": null
            },
            {
                "name": "web_2",
                "status": "running",
                "error": null
            }
        ],
        "stack_file_encoded": "ew0KICAidmFyaWFibGVzIjogWw0KICAgIHsNCiAgICAgICJrZXkiOiAidmFsdWUiDQogICAgfSwNCiAgICB7DQogICAgICAia2V5IjogeyAiY2hpbGRrZXkiOiAiY2hpbGR2YWx1ZSIgfQ0KICAgIH0NCiAgXSwNCg0KICAicmVzb3VyY2VzIjogew0KICAgICJ3ZWJfMSI6IHsNCiAgICAgICJ0eXBlIjogImRvY2tlci5pbWFnZSIsDQogICAgICAiaW1hZ2UiOiAiaGVsbG8td29ybGQiDQogICAgfSwNCg0KICAgICJ3ZWJfMiI6IHsNCiAgICAgICJ0eXBlIjogImRvY2tlci5idWlsZCIsDQogICAgICAic3JjIjogIi4iDQogICAgfQ0KICB9DQp9",
        "build_encoded": "ew0KICAiaWRlbnRpZmllciI6ICJ0ZXN0LXN0YWNrIiwNCiAgIm9iamVjdHMiOiB7DQogICAgImJ1aWxkcyI6IFsNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInRlc3QtYnVpbGQtaW1hZ2UiLA0KICAgICAgICAidGFnIjogInRlc3Qtd2l0aC1jdXN0b20taW1hZ2UiDQogICAgICB9DQogICAgXSwNCiAgICAiaW1hZ2VzIjogWw0KICAgICAgew0KICAgICAgICAibmFtZSI6ICJ0dXR1bS9oZWxsby13b3JsZCINCiAgICAgIH0NCiAgICBdLA0KICAgICJjb250YWluZXJzIjogWw0KICAgICAgew0KICAgICAgICAiaW1hZ2UiOiAidHV0dW0vaGVsbG8td29ybGQiLA0KICAgICAgICAibmFtZSI6ICJ3ZWJfMSIsDQogICAgICAgICJkZXRhY2giOiB0cnVlLA0KICAgICAgICAicG9ydHMiOiBbDQogICAgICAgICAgew0KICAgICAgICAgICAgImNvbnRhaW5lciI6ICI4MCIsDQogICAgICAgICAgICAiaG9zdCI6ICI0NDU0Ig0KICAgICAgICAgIH0NCiAgICAgICAgXQ0KICAgICAgfSwNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInR1dHVtL2hlbGxvLXdvcmxkIiwNCiAgICAgICAgIm5hbWUiOiAid2ViXzIiLA0KICAgICAgICAiZGV0YWNoIjogdHJ1ZSwNCiAgICAgICAgInBvcnRzIjogWw0KICAgICAgICAgIHsNCiAgICAgICAgICAgICJjb250YWluZXIiOiAiODAiLA0KICAgICAgICAgICAgImhvc3QiOiAiNDQ1NSINCiAgICAgICAgICB9DQogICAgICAgIF0NCiAgICAgIH0NCiAgICBdLA0KICAgICJuZXR3b3JrcyI6IFtdDQogIH0NCn0NCg0KDQo",
        "mode": "local",
        "provider": "local",
        "cloud_stack_id": null,
        "stack_file_location": "/full/path/to/my/project/stack/file",
        "status": "stopping",
        "health": "healthy"
    }
    var websocketConfig = { uri: 'ws://127.0.0.1:3111/stacks/stream' }

    it('should err trying to stop the stack', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            error: 'The stack could not be stopped.'
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdStart = new CmdStop(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig);

        expect(cmdStart.do({})).to.be.rejectedWith('The stack could not be stopped.')

    })


    it('should have current folder by default for request', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdStart = new CmdStop(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig);

        expect(cmdStart.parseOptions({})).to.contain({
            directory: process.cwd()
        })

    })


    it('should have specific identifier for request', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdStart = new CmdStop(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig);

        var options = {
            identifier: 'my-identifier'
        }

        expect(cmdStart.parseOptions(options)).to.contain({identifier: 'my-identifier'})

    })

    it('should get stack as response', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdStart = new CmdStop(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig);

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
                        status: 'stopping',
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
                status: 'stopping',
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
                        status: 'stopping',
                        exists: true,
                        is_running: true,
                        is_provisioned: false,
                        is_healthy: false
                    },
                    {
                        name: 'web_2',
                        status: 'stopping',
                        exists: true,
                        is_running: true,
                        is_provisioned: false,
                        is_healthy: false
                    }
                ],
                status: 'stopping',
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
                        status: 'stopped',
                        exists: true,
                        is_running: true,
                        is_provisioned: false,
                        is_healthy: false
                    },
                    {
                        name: 'web_2',
                        status: 'stopping',
                        exists: true,
                        is_running: true,
                        is_provisioned: false,
                        is_healthy: false
                    }
                ],
                status: 'stopping',
                health: 'unhealthy',
                terminated_on: null
            }
        }

        var response4 = {
            event: 'haystack-change',
            data: {
                identifier: 'test',
                services: [
                    {
                        name: 'web_1',
                        status: 'stopped',
                        exists: true,
                        is_running: true,
                        is_provisioned: false,
                        is_healthy: false
                    },
                    {
                        name: 'web_2',
                        status: 'stopped',
                        exists: true,
                        is_running: true,
                        is_provisioned: false,
                        is_healthy: false
                    }
                ],
                status: 'stopped',
                health: 'unhealthy',
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
            ws.send(JSON.stringify(response4));
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
        var cmdStart = new CmdStop(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig);


        var expected = [
            colors.yellow('test stack is stopping...'),
            'web_1 service is stopping',
            'web_2 service is stopping',
            'web_1 service is stopped',
            'web_2 service is stopped',
            colors.green('test stack has been stopped.')
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