#! /usr/bin/env node
const Promise = require('bluebird');
const colors = require('colors')
const GracefulErrorHandler = require('../lib/graceful-error-handler')
const ParseIdentifier = require('../lib/parse-identifier')
const CmdOptionText = require('../lib/cmd-option-text')

var CmdUnmount = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer) {
    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.printer = printer

    program
        .command('unmount <services...>')
        .description('Unmount a filesystem mount to the stack services.')
        .option('-i, --identifier <name>', CmdOptionText.identifier)
        .action(function (services, cmd) {
            if(services.length) {
                cmd.services = services
            }
            self.action(cmd)
        })
}

CmdUnmount.prototype.action = function(cmd) {
    var self = this

    this.parseOptions(cmd)
        .then(function (result) {
            return self.do(result)
        })
        .then(function (result) {
            self.printer.print(result.message)
        })
        .catch(function (err) {
            GracefulErrorHandler(self.printer, err)
        })
}

CmdUnmount.prototype.parseOptions = function (options) {
    var data = {}

    if (options.services) {
        data.services = options.services
    }

    return ParseIdentifier(this, options, data)
}

CmdUnmount.prototype.do = function(data) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.post('stacks/' + data.identifier + '/unmount', data)
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

module.exports = CmdUnmount;
