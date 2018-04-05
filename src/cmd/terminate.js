#! /usr/bin/env node
const Promise = require('bluebird');
const WebSocket = require('ws');
const colors = require('colors')
const consoleMessages = require('../lib/console-messages')
const ParseIdentifier = require('../lib/parse-identifier')
const GracefulErrorHandler = require('../lib/graceful-error-handler')
const CmdOptionText = require('../lib/cmd-option-text')

var CmdTerminate = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig) {
    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.websocketConfig = websocketConfig
    this.printer = printer

    program
        .command('terminate')
        .alias('rm')
        .description('Terminate a stack')
        .option('-i, --identifier <name>', CmdOptionText.identifier)
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
            GracefulErrorHandler(self.printer, err)
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
    return ParseIdentifier(this, options, {})
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

        ws.on('error', function (err) {
            ws.close()

            reject()
        })

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
