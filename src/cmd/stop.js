#! /usr/bin/env node
var Promise = require('bluebird');
var Validator = require('../lib/validator');
const WebSocket = require('ws');
const consoleMessages = require('../lib/console-messages')
const GracefulErrorHandler = require('../lib/graceful-error-handler')
const StackSearch = require('../lib/stack-search')

var CmdStop = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig){

    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.validator = new Validator();
    this.websocketConfig = websocketConfig
    this.printer = printer

    program
        .command('stop')
        .description('Stop a stack')
        .option('-i, --identifier <name>', 'name of your stack. If omitted, the folder name will be used')
        .action(function (cmd) {
            self.action(cmd)
        })

}

CmdStop.prototype.action = function(cmd) {

    var self = this

    this.do(cmd)
        .then(function (result) {
            self.websocketListeningAndConsoleMessaging(result)
                .then(function () {})
                .catch(function () {})
        })
        .catch(function (err){
            GracefulErrorHandler(self.printer, err)
        });

}

CmdStop.prototype.do = function(options) {
    var self = this;

    return new Promise(function (resolve, reject) {

        var data = self.parseOptions(options)

        // start the stack
        self.stopStack(data)
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

CmdStop.prototype.parseOptions = function (options) {
    var self = this

    return new Promise(function (resolve, reject) {
        var data = {
            action: 'stop'
        }

        if( ! options.identifier) {
            var params = {
                stack_file_location: process.cwd()
            }
            StackSearch(self.hayStackServiceAdapter, params)
                .then(function (result) {
                    if(result.length) {
                        data.identifier = result[0].identifier

                        resolve(data)
                    }
                    else {
                        var rejection = {
                            type: 'info',
                            message: 'No stack found at this location. Please provide the stack identifier with the -i option.'
                        }
                        reject(rejection)
                    }
                })
                .catch(function (err) {
                    reject(err)
                })
        }
        else if (options.identifier && typeof options.identifier === 'string') {
            data.identifier = options.identifier

            resolve(data)
        }
    })
}

CmdStop.prototype.stopStack = function (data) {

    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.put('stacks/' + data.identifier, data)
            .then(function (result) {
                if (Object.keys(result).length) {
                    resolve(result)
                }
                else {
                    reject({ message: consoleMessages.haystackNotRunning })
                }
            })
            .catch(function (err) {
                reject(err)
            })
    })

}

CmdStop.prototype.websocketListeningAndConsoleMessaging = function (result) {

    var self = this

    return new Promise(function (resolve, reject) {

        const ws = new WebSocket(self.websocketConfig.uri);

        var error = false

        ws.on('error', function (err) {
            // self.printer.print(consoleMessages.haystackNotRunning)

            ws.close()

            reject()

            error = true
        })

        if (error) {
            reject()
        }

        var receivedServices = {}
        result.services.forEach(function (service) {
            receivedServices[service.name] = service.status
        })

        self.printer.print(consoleMessages.stopping, [result.identifier])

        ws.on('message', function incoming(m) {
            var message = JSON.parse(m)
            var event = message.event
            var data = message.data

            if (data.identifier === result.identifier)
            {
                // print services' updates
                data.services.forEach(function (service) {
                    if(receivedServices[service.name] !== service.status) {
                        receivedServices[service.name] = service.status
                        self.printer.print(consoleMessages.serviceIs, [service.name, service.status])
                    }
                })

                // switch between statuses for output messages
                switch(data.status) {
                    case 'stopping':
                        break
                    case 'stopped':
                        self.printer.print(consoleMessages.stopped, [data.identifier])
                        ws.close()
                        resolve()
                        break
                    default:
                        ws.close()
                        resolve()
                        break
                }
            }
        })
    })
}

module.exports = CmdStop;
