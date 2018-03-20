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
        "_id": "ecd7ba4c5f994baf8af0bccf8763147d",
        "identifier": "test",
        "services": [
            {
                "name": "web_1",
                "status": "pending",
                "exists": false,
                "is_running": false,
                "is_provisioned": false,
                "is_healthy": false
            },
            {
                "name": "web_2",
                "status": "pending",
                "exists": false,
                "is_running": false,
                "is_provisioned": false,
                "is_healthy": false
            }
        ],
        "haystack_file_encoded": "ew0KICAidmFyaWFibGVzIjogWw0KICAgIHsNCiAgICAgICJrZXkiOiAidmFsdWUiDQogICAgfSwNCiAgICB7DQogICAgICAia2V5IjogeyAiY2hpbGRrZXkiOiAiY2hpbGR2YWx1ZSIgfQ0KICAgIH0NCiAgXSwNCg0KICAic2VydmljZXMiOiB7DQogICAgIndlYl8xIjogew0KICAgICAgInR5cGUiOiAiZG9ja2VyLmltYWdlIiwNCiAgICAgICJpbWFnZSI6ICJoZWxsby13b3JsZCINCiAgICB9LA0KDQogICAgIndlYl8yIjogew0KICAgICAgInR5cGUiOiAiZG9ja2VyLmJ1aWxkIiwNCiAgICAgICJzcmMiOiAiLiINCiAgICB9DQogIH0NCn0=",
        "build_encoded": "ew0KICAiaWRlbnRpZmllciI6ICJ0ZXN0LXN0YWNrIiwNCiAgIm9iamVjdHMiOiB7DQogICAgImJ1aWxkcyI6IFsNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInRlc3QtYnVpbGQtaW1hZ2UiLA0KICAgICAgICAidGFnIjogInRlc3Qtd2l0aC1jdXN0b20taW1hZ2UiDQogICAgICB9DQogICAgXSwNCiAgICAiaW1hZ2VzIjogWw0KICAgICAgew0KICAgICAgICAibmFtZSI6ICJ0dXR1bS9oZWxsby13b3JsZCINCiAgICAgIH0NCiAgICBdLA0KICAgICJjb250YWluZXJzIjogWw0KICAgICAgew0KICAgICAgICAiaW1hZ2UiOiAidHV0dW0vaGVsbG8td29ybGQiLA0KICAgICAgICAibmFtZSI6ICJ3ZWJfMSIsDQogICAgICAgICJkZXRhY2giOiB0cnVlLA0KICAgICAgICAicG9ydHMiOiBbDQogICAgICAgICAgew0KICAgICAgICAgICAgImNvbnRhaW5lciI6ICI4MCIsDQogICAgICAgICAgICAiaG9zdCI6ICI0NDU0Ig0KICAgICAgICAgIH0NCiAgICAgICAgXQ0KICAgICAgfSwNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInR1dHVtL2hlbGxvLXdvcmxkIiwNCiAgICAgICAgIm5hbWUiOiAid2ViXzIiLA0KICAgICAgICAiZGV0YWNoIjogdHJ1ZSwNCiAgICAgICAgInBvcnRzIjogWw0KICAgICAgICAgIHsNCiAgICAgICAgICAgICJjb250YWluZXIiOiAiODAiLA0KICAgICAgICAgICAgImhvc3QiOiAiNDQ1NSINCiAgICAgICAgICB9DQogICAgICAgIF0NCiAgICAgIH0NCiAgICBdLA0KICAgICJuZXR3b3JrcyI6IFtdDQogIH0NCn0NCg0KDQo",
        "mode": "local",
        "provider": "local",
        "stack_file_location": null,
        "status": "starting",
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
            stack_file_location: process.cwd(),
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

        // messages
        var message1 = {
            "_id": "ecd7ba4c5f994baf8af0bccf8763147d",
            "identifier": "test",
            "services": [
                {
                    "name": "web_1",
                    "status": "pending",
                    "exists": false,
                    "is_running": false,
                    "is_provisioned": false,
                    "is_healthy": false
                },
                {
                    "name": "web_2",
                    "status": "pending",
                    "exists": false,
                    "is_running": false,
                    "is_provisioned": false,
                    "is_healthy": false
                }
            ],
            "haystack_file_encoded": "ew0KICAidmFyaWFibGVzIjogWw0KICAgIHsNCiAgICAgICJrZXkiOiAidmFsdWUiDQogICAgfSwNCiAgICB7DQogICAgICAia2V5IjogeyAiY2hpbGRrZXkiOiAiY2hpbGR2YWx1ZSIgfQ0KICAgIH0NCiAgXSwNCg0KICAic2VydmljZXMiOiB7DQogICAgIndlYl8xIjogew0KICAgICAgInR5cGUiOiAiZG9ja2VyLmltYWdlIiwNCiAgICAgICJpbWFnZSI6ICJoZWxsby13b3JsZCINCiAgICB9LA0KDQogICAgIndlYl8yIjogew0KICAgICAgInR5cGUiOiAiZG9ja2VyLmJ1aWxkIiwNCiAgICAgICJzcmMiOiAiLiINCiAgICB9DQogIH0NCn0=",
            "build_encoded": "ew0KICAiaWRlbnRpZmllciI6ICJ0ZXN0LXN0YWNrIiwNCiAgIm9iamVjdHMiOiB7DQogICAgImJ1aWxkcyI6IFsNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInRlc3QtYnVpbGQtaW1hZ2UiLA0KICAgICAgICAidGFnIjogInRlc3Qtd2l0aC1jdXN0b20taW1hZ2UiDQogICAgICB9DQogICAgXSwNCiAgICAiaW1hZ2VzIjogWw0KICAgICAgew0KICAgICAgICAibmFtZSI6ICJ0dXR1bS9oZWxsby13b3JsZCINCiAgICAgIH0NCiAgICBdLA0KICAgICJjb250YWluZXJzIjogWw0KICAgICAgew0KICAgICAgICAiaW1hZ2UiOiAidHV0dW0vaGVsbG8td29ybGQiLA0KICAgICAgICAibmFtZSI6ICJ3ZWJfMSIsDQogICAgICAgICJkZXRhY2giOiB0cnVlLA0KICAgICAgICAicG9ydHMiOiBbDQogICAgICAgICAgew0KICAgICAgICAgICAgImNvbnRhaW5lciI6ICI4MCIsDQogICAgICAgICAgICAiaG9zdCI6ICI0NDU0Ig0KICAgICAgICAgIH0NCiAgICAgICAgXQ0KICAgICAgfSwNCiAgICAgIHsNCiAgICAgICAgImltYWdlIjogInR1dHVtL2hlbGxvLXdvcmxkIiwNCiAgICAgICAgIm5hbWUiOiAid2ViXzIiLA0KICAgICAgICAiZGV0YWNoIjogdHJ1ZSwNCiAgICAgICAgInBvcnRzIjogWw0KICAgICAgICAgIHsNCiAgICAgICAgICAgICJjb250YWluZXIiOiAiODAiLA0KICAgICAgICAgICAgImhvc3QiOiAiNDQ1NSINCiAgICAgICAgICB9DQogICAgICAgIF0NCiAgICAgIH0NCiAgICBdLA0KICAgICJuZXR3b3JrcyI6IFtdDQogIH0NCn0NCg0KDQo",
            "mode": "local",
            "provider": "local",
            "stack_file_location": null,
            "status": "starting",
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

        var message2 = {
            "_id": "ecd7ba4c5f994baf8af0bccf8763147d",
            "identifier": "test",
            "services": [
                {
                    "name": "web_1",
                    "status": "provisioning",
                    "exists": false,
                    "is_running": false,
                    "is_provisioned": false,
                    "is_healthy": false
                },
                {
                    "name": "web_2",
                    "status": "pending",
                    "exists": false,
                    "is_running": false,
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

        var message3 = {
            "_id": "ecd7ba4c5f994baf8af0bccf8763147d",
            "identifier": "test",
            "services": [
                {
                    "name": "web_1",
                    "status": "provisioning",
                    "exists": false,
                    "is_running": false,
                    "is_provisioned": false,
                    "is_healthy": false
                },
                {
                    "name": "web_2",
                    "status": "provisioning",
                    "exists": false,
                    "is_running": false,
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

        var message4 = {
            "_id": "ecd7ba4c5f994baf8af0bccf8763147d",
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
                    "status": "provisioning",
                    "exists": false,
                    "is_running": false,
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

        var message5 = {
            "_id": "ecd7ba4c5f994baf8af0bccf8763147d",
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

        wss.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
            });

            ws.send(JSON.stringify(message1));
            ws.send(JSON.stringify(message2));
            ws.send(JSON.stringify(message3));
            ws.send(JSON.stringify(message4));
            ws.send(JSON.stringify(message5));
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
            colors.yellow('test stack is starting...'),
            'web_1 service is provisioning',
            'web_2 service is provisioning',
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
            .catch(function () {
                console.log(messages)
                console.log(colors.red('the expect failed'))
            })



    })

})