#! /usr/bin/env node
var Promise = require('bluebird');
var Validator = require('../lib/validator');
const WebSocket = require('ws');
const colors = require('colors')
const consoleMessages = require('../lib/console-messages')

var CmdStart = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer, websocketConfig){

    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.validator = new Validator();
    this.websocketConfig = websocketConfig
    this.printer = printer

    program
        .command('start')
        .description('Launch a stack')
        .option('-i, --identifier <name>', 'name of your stack. If omitted, the folder name will be used')
        .option('-x, --exclude-mount', 'no file system mounts to the stack will be created')
        .action(function (cmd) {
            self.action(cmd)
        })

}

CmdStart.prototype.action = function(cmd) {

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

CmdStart.prototype.do = function(options) {
    var self = this;

    return new Promise(function (resolve, reject) {

        var data = self.parseOptions(options)

        // start the stack
        self.startStack(data)
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

CmdStart.prototype.parseOptions = function (options) {
    // default data
    var data = {
        directory: process.cwd(),
        mount: true
    }

    // identifier flag with string
    if (options.identifier && typeof options.identifier === 'string') {
        data.identifier = options.identifier
    }

    // disabling mount
    if (options.excludeMount) {
        data.mount = false
    }

    return data
}

CmdStart.prototype.startStack = function (data) {

    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.post('stacks', data)
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

CmdStart.prototype.websocketListeningAndConsoleMessaging = function (result) {

    var self = this

    return new Promise(function (resolve, reject) {

        const ws = new WebSocket(self.websocketConfig.uri);

        var error = false

        ws.on('error', function (err) {
            self.printer.print(consoleMessages.haystackNotRunning)

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

        self.printer.print(consoleMessages.starting, [result.identifier])

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
                    case 'starting':
                    case 'provisioning':
                        break
                    case 'impaired':
                        self.printer.print(consoleMessages.impaired, [message.identifier])
                        ws.close()
                        resolve()
                        break
                    case 'running':
                        self.printer.print(consoleMessages.running, [message.identifier])
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

module.exports = CmdStart;
