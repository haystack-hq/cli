#! /usr/bin/env node
const Promise = require('bluebird');
const WebSocket = require('ws');
const consoleMessages = require('../lib/console-messages')
const GracefulErrorHandler = require('../lib/graceful-error-handler')
const ParseIdentifier = require('../lib/parse-identifier')
const CmdOptionText = require('../lib/cmd-option-text')

var CmdStop = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig) {
    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.websocketConfig = websocketConfig
    this.printer = printer

    program
        .command('stop')
        .description('Stop a stack')
        .option('-i, --identifier <name>', CmdOptionText.identifier)
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

        // parse options
        self.parseOptions(options)
            .then(function (result) {
                // start the stack
                return self.stopStack(result)
            })
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

CmdStop.prototype.parseOptions = function (options) {
    var data = {
        action: 'stop'
    }

    return ParseIdentifier(this, options, data)
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
