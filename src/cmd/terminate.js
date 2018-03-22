#! /usr/bin/env node
var Promise = require('bluebird');
var Validator = require('../lib/validator');
const WebSocket = require('ws');
const colors = require('colors')
const consoleMessages = require('../lib/console-messages')
const StackSearch = require('../lib/stack-search')

var CmdTerminate = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig){

    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.validator = new Validator();
    this.websocketConfig = websocketConfig
    this.printer = printer

    program
        .command('terminate')
        .alias('rm')
        .description('Terminate a stack')
        .option('-i, --identifier <name>', 'name of stack. If omitted, the stack from the current folder will be used')
        .action(function (cmd) {
            self.action(cmd)
        })

}

CmdTerminate.prototype.action = function(cmd) {

    var self = this

    this.do(cmd)
        .then(function (result) {
            self.websocketListeningAndConsoleMessaging(result)
                .then(function () {})
                .catch(function () {})
        })
        .catch(function (err){
            if (err.errno === 'ECONNREFUSED') {
                self.printer.print(consoleMessages.haystackNotRunning)
                self.printer.print(colors.red(err.errno + ' on port ' + err.port + '.'))
            }
            else {
                self.printer.print(colors.red(err))
            }
        });

}

CmdTerminate.prototype.do = function(options) {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.parseOptions(options)
            .then(function (result) {
                // terminate the stack
                return self.terminateStack(result)
            })
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

CmdTerminate.prototype.parseOptions = function (options) {
    var self = this

    return new Promise(function (resolve, reject) {
        var data = {}

        if( ! options.identifier) {
            var params = {
                stack_file_location: process.cwd()
            }
            StackSearch(self.hayStackServiceAdapter, params)
                .then(function (result) {
                    if(result.length) {
                        data = {
                            identifier: result[0].identifier
                        }

                        resolve(data)
                    }
                    else {
                        reject('No stack found at this location')
                    }
                })
                .catch(function (err) {
                    reject(err)
                })
        }
        else if (options.identifier && typeof options.identifier === 'string') {
            data = {
                identifier: options.identifier
            }

            resolve(data)
        }
    })
}

CmdTerminate.prototype.terminateStack = function (data) {

    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.delete('stacks/' + data.identifier)
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

CmdTerminate.prototype.websocketListeningAndConsoleMessaging = function (result) {

    var self = this

    return new Promise(function (resolve, reject) {

        const ws = new WebSocket(self.websocketConfig.uri);

        var error = false

        ws.on('error', function (err) {
            // self.printer.print(colors.red(consoleMessages.haystackNotRunning))

            ws.close()

            reject()

            error = true
        })

        if (error) {
            reject()
            return
        }

        var receivedServices = {}
        result.services.forEach(function (service) {
            receivedServices[service.name] = service.status
        })

        self.printer.print(consoleMessages.terminating, [result.identifier])

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
                    case 'terminating':
                        break
                    case 'terminated':
                        self.printer.print(consoleMessages.terminated, [data.identifier])
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

module.exports = CmdTerminate;
