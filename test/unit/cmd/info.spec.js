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
        "_id": "9d3816f9d36e4d648a3b01edfbf9b00e",
        "identifier": "test",
        "services": [
            {
                "name": "web_1",
                "status": "running",
                "exists": true,
                "is_running": true,
                "is_provisioned": true,
                "is_healthy": true
            },
            {
                "name": "web_2",
                "status": "running",
                "exists": true,
                "is_running": true,
                "is_provisioned": true,
                "is_healthy": true
            }
        ],
        "haystack_file_encoded": "ew0KICAidmFyaWFibGVzIjogWw0KICAgIHsNCiAgICAgICJrZXkiOiAidmFsdWUiDQogICAgfSwNCiAgICB7DQogICAgICAia2V5IjogeyAiY2hpbGRrZXkiOiAiY2hpbGR2YWx1ZSIgfQ0KICAgIH0NCiAgXSwNCg0KICAic2VydmljZXMiOiB7DQogICAgIndlYl8xIjogew0KICAgICAgInR5cGUiOiAiZG9ja2VyLmltYWdlIiwNCiAgICAgICJpbWFnZSI6ICJoZWxsby13b3JsZCINCiAgICB9LA0KDQogICAgIndlYl8yIjogew0KICAgICAgInR5cGUiOiAiZG9ja2VyLmJ1aWxkIiwNCiAgICAgICJzcmMiOiAiLiINCiAgICB9DQogIH0NCn0=",
        "build_encoded": "ew0KICAiaWRlbnRpZmllciI6ICJ0ZXN0LXN0YWNrIiwNCiAgIm9iamVjdHMiOiB7DQogICAgImJ1aWxkcyI6IFsNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInRlc3QtYnVpbGQtaW1hZ2UiLA0KICAgICAgICAidGFnIjogInRlc3Qtd2l0aC1jdXN0b20taW1hZ2UiDQogICAgICB9DQogICAgXSwNCiAgICAiaW1hZ2VzIjogWw0KICAgICAgew0KICAgICAgICAibmFtZSI6ICJ0dXR1bS9oZWxsby13b3JsZCINCiAgICAgIH0NCiAgICBdLA0KICAgICJjb250YWluZXJzIjogWw0KICAgICAgew0KICAgICAgICAiaW1hZ2UiOiAidHV0dW0vaGVsbG8td29ybGQiLA0KICAgICAgICAibmFtZSI6ICJ3ZWJfMSIsDQogICAgICAgICJkZXRhY2giOiB0cnVlLA0KICAgICAgICAicG9ydHMiOiBbDQogICAgICAgICAgew0KICAgICAgICAgICAgImNvbnRhaW5lciI6ICI4MCIsDQogICAgICAgICAgICAiaG9zdCI6ICI0NDU0Ig0KICAgICAgICAgIH0NCiAgICAgICAgXQ0KICAgICAgfSwNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInR1dHVtL2hlbGxvLXdvcmxkIiwNCiAgICAgICAgIm5hbWUiOiAid2ViXzIiLA0KICAgICAgICAiZGV0YWNoIjogdHJ1ZSwNCiAgICAgICAgInBvcnRzIjogWw0KICAgICAgICAgIHsNCiAgICAgICAgICAgICJjb250YWluZXIiOiAiODAiLA0KICAgICAgICAgICAgImhvc3QiOiAiNDQ1NSINCiAgICAgICAgICB9DQogICAgICAgIF0NCiAgICAgIH0NCiAgICBdLA0KICAgICJuZXR3b3JrcyI6IFtdDQogIH0NCn0NCg0KDQo",
        "mode": "local",
        "provider": "local",
        "stack_file_location": null,
        "status": "running",
        "health": "healthy",
        "created_by": null,
        "do_mount": false,
        "terminated_on": 1521492317971,
        "haystack_file": {
            "variables": [
                {
                    "key": "value"
                },
                {
                    "key": {
                        "childkey": "childvalue"
                    }
                }
            ],
            "services": {
                "web_1": {
                    "type": "docker.image",
                    "image": "hello-world"
                },
                "web_2": {
                    "type": "docker.build",
                    "src": "."
                }
            }
        },
        "build": {
            "identifier": "test-stack",
            "objects": {
                "builds": [
                    {
                        "image": "test-build-image",
                        "tag": "test-with-custom-image"
                    }
                ],
                "images": [
                    {
                        "name": "tutum/hello-world"
                    }
                ],
                "containers": [
                    {
                        "image": "tutum/hello-world",
                        "name": "web_1",
                        "detach": true,
                        "ports": [
                            {
                                "container": "80",
                                "host": "4454"
                            }
                        ]
                    },
                    {
                        "image": "tutum/hello-world",
                        "name": "web_2",
                        "detach": true,
                        "ports": [
                            {
                                "container": "80",
                                "host": "4455"
                            }
                        ]
                    }
                ],
                "networks": []
            }
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

    it('should have the identifier passed as the identifier option', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdInfo = new CmdInfo(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        expect(cmdInfo.parseOptions({ identifier: 'my-id' })).to.eventually.deep.equal({ identifier: 'my-id' })

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
        table.push(['Identifier:', response.identifier])
        // status
        table.push(['Status:', capitalize(response.status)])
        // health
        table.push(['Health:', capitalize(response.health)])
        // services
        table.push(['Services:', response.services.length])

        expected.push(table.toString())

        // single services
        response.services.forEach(function (service, key) {
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