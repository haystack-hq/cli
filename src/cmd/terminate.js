#! /usr/bin/env node
var Promise = require('bluebird');
var Validator = require('../lib/validator');
const WebSocket = require('ws');
const colors = require('colors')
const consoleMessages = require('../lib/console-messages')

var CmdTerminate = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig){

    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.validator = new Validator();
    this.websocketConfig = websocketConfig
    this.printer = printer

    program
        .command('terminate')
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
            self.printer.print(colors.red(err.message))
        });

}

CmdTerminate.prototype.do = function(options) {
    var self = this;

    return new Promise(function (resolve, reject) {

        var data = self.parseOptions(options)

        // start the stack
        self.terminateStack(data)
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

CmdTerminate.prototype.parseOptions = function (options) {
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

CmdTerminate.prototype.terminateStack = function (data) {

    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.delete('stacks', data)
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
            self.printer.print(colors.red(consoleMessages.haystackNotRunning))

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

            if (message.identifier === result.identifier)
            {
                // print services' updates
                message.services.forEach(function (service) {
                    if(receivedServices[service.name] !== service.status) {
                        receivedServices[service.name] = service.status
                        self.printer.print(consoleMessages.serviceIs, [service.name, service.status])
                    }
                })

                // switch between statuses for output messages
                switch(message.status) {
                    case 'terminating':
                        break
                    case 'terminated':
                        self.printer.print(consoleMessages.terminated, [message.identifier])
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
