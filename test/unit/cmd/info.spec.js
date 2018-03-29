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
const Table = require('cli-table2')
const capitalize = require('capitalize')

describe('cmd-info', function () {

    var printer = new Printer()
    var cmdPromptAdapter = new CmdPromptAdapter(new InquireTestAdapter());
    var response = {
        "_id": "d8bec439053145efa1fc487d884905a6",
        "identifier": "simple-haystack-file",
        "services": [
            {
                "name": "web_1",
                "status": "provisioning",
                "exists": true,
                "is_running": true,
                "is_provisioned": false,
                "is_healthy": false,
                "error": {
                    "message": "It failed with port 80 already being used."
                }
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
        "mode": "local",
        "provider": "local",
        "stack_file_location": "/Users/jaime/gosolid/haystack/haystack-agent/resources/simple-haystack-file/Haystackfile.json",
        "status": "provisioning",
        "health": "unhealthy",
        "created_by": null,
        "do_mount": false,
        "terminated_on": null,
        "haystack_file": {
            "services": {
                "web_1": {
                    "type": "docker.container",
                    "image": "tutum/hello-world",
                    "ports": [
                        {
                            "container": "80",
                            "host": "4458"
                        }
                    ]
                },
                "web_2": {
                    "type": "docker.container",
                    "image": "tutum/hello-world",
                    "ports": [
                        {
                            "container": "80",
                            "host": "4459"
                        }
                    ]
                }
            }
        },
        "build": {
            "identifier": "simple-haystack-file",
            "objects": {
                "builds": [],
                "images": [
                    "tutum/hello-world",
                    "tutum/hello-world"
                ],
                "containers": [
                    {
                        "name": "web_1",
                        "detatch": true,
                        "labels": {
                            "com.haystack.identifier": "simple-haystack-file"
                        },
                        "image": "tutum/hello-world",
                        "ports": [
                            {
                                "container": "80",
                                "host": "4458"
                            }
                        ]
                    },
                    {
                        "name": "web_2",
                        "detatch": true,
                        "labels": {
                            "com.haystack.identifier": "simple-haystack-file"
                        },
                        "image": "tutum/hello-world",
                        "ports": [
                            {
                                "container": "80",
                                "host": "4459"
                            }
                        ]
                    }
                ],
                "networks": [
                    null,
                    null
                ]
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

    it('should request to get the identifier via search and get empty response, err with message', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: []
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdInfo = new CmdInfo(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        expect(cmdInfo.parseOptions({})).to.be.rejectedWith('No stack found at this location')

    })

    it('should request to get the identifier via search', function () {

        var searchResult = [{
            _id: '768fdec94deb4c3fa1b2344b414f7766',
            identifier: 'test',
            services: [ [Object], [Object] ],
            mode: 'local',
            provider: 'local',
            stack_file_location: '/Users/jaime/gosolid/haystack/haystack-agent/resources/simple-haystack-file/Haystackfile.json',
            status: 'starting',
            health: 'unhealthy',
            created_by: null,
            do_mount: false,
            terminated_on: null,
            haystack_file: { services: [Object] },
            build: { identifier: 'test', objects: [Object] }
        }]

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: searchResult
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdInfo = new CmdInfo(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        expect(cmdInfo.parseOptions({})).to.eventually.contain({ identifier: 'test' })

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
        // stack file location
        table.push(['Stack File Location:', capitalize(response.stack_file_location)])
        // mode
        table.push(['Mode:', capitalize(response.mode)])
        // terminated on
        if(response.terminated_on) {
            table.push(['Terminated On:', new Date(response.terminated_on)])
        }

        // services
        table.push(['Services:', response.services.length])

        expected.push(table.toString())

        // single services
        response.services.forEach(function (service, key) {
            expected.push(' ' + service.name + ' service:')

            table = new Table({
                chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
                    , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
                    , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
                    , 'right': '' , 'right-mid': '' , 'middle': '' },
                style: { 'padding-left': 1, 'padding-right': 0 }
            });

            table.push([' ', 'Status:', capitalize(service.status)])
            table.push([' ', 'Exists:', cmdInfo.boolToString(service.exists)])
            table.push([' ', 'Running:', cmdInfo.boolToString(service.is_running)])
            table.push([' ', 'Provisioned:', cmdInfo.boolToString(service.is_provisioned)])
            table.push([' ', 'Healthy:', cmdInfo.boolToString(service.is_healthy)])
            table.push([' ', 'External Port:', response.haystack_file.services[service.name].ports[0].host])
            // if an error was sent
            if (service.error && service.error.message) {
                table.push([' ', 'Error:', service.error.message])
            }

            expected.push(table.toString())
        })

        cmdInfo.printInfo(response)

        expect(messages).to.deep.equal(expected)

    })

})
