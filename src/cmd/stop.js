#! /usr/bin/env node
var Promise = require('bluebird');
var Validator = require('../lib/validator');
var Spinner = require('cli-spinner').Spinner;
const WebSocket = require('ws');
const colors = require('colors')
const consoleMessages = require('../lib/console-messages')

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
        .option('-i, --identifier <name>', 'name of stack. If omitted, the stack from the current folder will be used')
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
            self.printer.print(colors.red(err.message))
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
    // default data
    var data = {
        directory: process.cwd()
    }

    // identifier flag with string
    if (options.identifier && typeof options.identifier === 'string') {
        data.identifier = options.identifier
    }

    return data
}

CmdStop.prototype.stopStack = function (data) {

    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.delete('stacks', data)
            .then(function (result) {
                if (Object.keys(result).length) {
                    resolve(result)
                }
                else {
                    reject({ message: consoleMessages.noAgent })
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
            self.printer.print(colors.red(consoleMessages.noAgent))

            ws.close()

            reject()

            error = true
        })

        if (error) {
            reject()
            return
        }

        var received = {
            stopping: true,
            services: {}
        }
        result.services.forEach(function (service) {
            received.services[service.name] = service.status
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
                    if(received.services[service.name] !== service.status) {
                        received.services[service.name] = service.status
                        self.printer.print(consoleMessages.serviceIs, [service.name, service.status])
                    }
                })

                // switch between statuses for output messages
                switch(data.status) {
                    case 'stopping':
                        if ( ! received.stopping) {
                            received.stopping = true
                            self.printer.print(consoleMessages.stopping, [data.identifier])
                        }
                        break
                    case 'stopped':
                        received.running = true
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
