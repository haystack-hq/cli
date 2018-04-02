#! /usr/bin/env node
const Promise = require('bluebird');
const consoleMessages = require('../lib/console-messages')
const GracefulErrorHandler = require('../lib/graceful-error-handler')
const ParseIdentifier = require('../lib/parse-identifier')
const CmdOptionText = require('../lib/cmd-option-text')

var CmdLogs = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer) {
    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.printer = printer

    program
        .command('logs <service>')
        .description('Display logs for a stack service')
        .option('-i, --identifier <name>', CmdOptionText.identifier)
        .action(function (cmd) {
            self.action(cmd)
        })
}

CmdLogs.prototype.action = function(cmd) {
    var self = this

    this.do(cmd)
        .then(function (result) {
            self.printLogs(result)
        })
        .catch(function (err){
            GracefulErrorHandler(self.printer, err)
        });
}

CmdLogs.prototype.do = function(options) {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.parseOptions(options)
            .then(function (result) {
                // start the stack
                return self.getLogs(result)
            })
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

CmdLogs.prototype.parseOptions = function (options) {
    data = {
        service: options.service
    }

    return ParseIdentifier(this, options, {})
}

CmdLogs.prototype.getLogs = function (data) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.get('stacks/' + data.identifier + '/services/' + data.service + '/logs')
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

CmdLogs.prototype.printLogs = function (result) {
    var self = this

    result.forEach(function (message) {
        self.printer.print(message)
    })
}

module.exports = CmdLogs;
