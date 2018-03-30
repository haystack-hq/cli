#! /usr/bin/env node
var CmdPromptAdapter = require('../../../src/adapters/cmd-prompt-adapter');
var InquireTestAdapter = require('../inquirer-test-adapter');
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var ApiTestAdapter = require('../api-test-adapter');
var CmdList = require('../../../src/cmd/list');
var program = require('commander');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Table = require('cli-table2')
var colors = require('colors')
var Printer = require('../../../src/lib/printer')

describe('cmd-list', function () {

    var cmdPromptAdapter = new CmdPromptAdapter(new InquireTestAdapter());
    var response = [
        {
            "_id": "9d3816f9d36e4d648a3b01edfbf9b00e",
            "identifier": "test",
            "services": [
                {
                    "name": "web_1",
                    "status": "provisioning",
                    "exists": true,
                    "is_running": true,
                    "is_provisioned": false,
                    "is_healthy": false
                },
                {
                    "name": "web_2",
                    "status": "provisioning",
                    "exists": true,
                    "is_running": true,
                    "is_provisioned": false,
                    "is_healthy": false
                }
            ],
            "haystack_file_encoded": "ew0KICAidmFyaWFibGVzIjogWw0KICAgIHsNCiAgICAgICJrZXkiOiAidmFsdWUiDQogICAgfSwNCiAgICB7DQogICAgICAia2V5IjogeyAiY2hpbGRrZXkiOiAiY2hpbGR2YWx1ZSIgfQ0KICAgIH0NCiAgXSwNCg0KICAic2VydmljZXMiOiB7DQogICAgIndlYl8xIjogew0KICAgICAgInR5cGUiOiAiZG9ja2VyLmltYWdlIiwNCiAgICAgICJpbWFnZSI6ICJoZWxsby13b3JsZCINCiAgICB9LA0KDQogICAgIndlYl8yIjogew0KICAgICAgInR5cGUiOiAiZG9ja2VyLmJ1aWxkIiwNCiAgICAgICJzcmMiOiAiLiINCiAgICB9DQogIH0NCn0=",
            "build_encoded": "ew0KICAiaWRlbnRpZmllciI6ICJ0ZXN0LXN0YWNrIiwNCiAgIm9iamVjdHMiOiB7DQogICAgImJ1aWxkcyI6IFsNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInRlc3QtYnVpbGQtaW1hZ2UiLA0KICAgICAgICAidGFnIjogInRlc3Qtd2l0aC1jdXN0b20taW1hZ2UiDQogICAgICB9DQogICAgXSwNCiAgICAiaW1hZ2VzIjogWw0KICAgICAgew0KICAgICAgICAibmFtZSI6ICJ0dXR1bS9oZWxsby13b3JsZCINCiAgICAgIH0NCiAgICBdLA0KICAgICJjb250YWluZXJzIjogWw0KICAgICAgew0KICAgICAgICAiaW1hZ2UiOiAidHV0dW0vaGVsbG8td29ybGQiLA0KICAgICAgICAibmFtZSI6ICJ3ZWJfMSIsDQogICAgICAgICJkZXRhY2giOiB0cnVlLA0KICAgICAgICAicG9ydHMiOiBbDQogICAgICAgICAgew0KICAgICAgICAgICAgImNvbnRhaW5lciI6ICI4MCIsDQogICAgICAgICAgICAiaG9zdCI6ICI0NDU0Ig0KICAgICAgICAgIH0NCiAgICAgICAgXQ0KICAgICAgfSwNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInR1dHVtL2hlbGxvLXdvcmxkIiwNCiAgICAgICAgIm5hbWUiOiAid2ViXzIiLA0KICAgICAgICAiZGV0YWNoIjogdHJ1ZSwNCiAgICAgICAgInBvcnRzIjogWw0KICAgICAgICAgIHsNCiAgICAgICAgICAgICJjb250YWluZXIiOiAiODAiLA0KICAgICAgICAgICAgImhvc3QiOiAiNDQ1NSINCiAgICAgICAgICB9DQogICAgICAgIF0NCiAgICAgIH0NCiAgICBdLA0KICAgICJuZXR3b3JrcyI6IFtdDQogIH0NCn0NCg0KDQo",
            "mode": "local",
            "provider": "local",
            "stack_file_location": null,
            "status": "provisioning",
            "health": "unhealthy",
            "created_by": null,
            "do_mount": false,
            "terminated_on": null,
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
                            ],
                            "labels": {
                                "com.haystack.identifier": "test"
                            }
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
                            ],
                            "labels": {
                                "com.haystack.identifier": "test"
                            }
                        }
                    ],
                    "networks": []
                }
            }
        }
    ]

    it('should print error connecting to agent because it is not running', function () {

        var error = {
            code: 'ECONNREFUSED',
            errno: 'ECONNREFUSED',
            syscall: 'connect',
            address: '127.0.0.1',
            port: 3000
        }

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            error: error
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdList = new CmdList(program, hayStackServiceAdapter, cmdPromptAdapter);

        expect(cmdList.getStacks({})).to.be.rejectedWith(error)

    })

    it('should get no stacks message', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: []
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdList = new CmdList(program, hayStackServiceAdapter, cmdPromptAdapter);

        expect(cmdList.do()).to.be.rejectedWith('There are currently no stacks running.')

    })

    it('should get stacks', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdList = new CmdList(program, hayStackServiceAdapter, cmdPromptAdapter);

        expect(cmdList.getStacks()).to.eventually.equal(response)

    })

    it('should display stacks table', function () {

        var expected = new Table({
            head: ['identifier', 'provider', 'status', 'health'],
            style: {
                head: ['bold']
            }
        })
        response.forEach(function (stack) {
            expected.push([
                stack.identifier,
                stack.provider,
                stack.status,
                stack.health
            ])
        })

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdList = new CmdList(program, hayStackServiceAdapter, cmdPromptAdapter);

        expect(cmdList.do()).to.eventually.equal(expected.toString())

    })



})