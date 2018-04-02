#! /usr/bin/env node
const Promise = require('bluebird');
const colors = require('colors')
const GracefulErrorHandler = require('../lib/graceful-error-handler')
const ParseIdentifier = require('../lib/parse-identifier')
const CmdOptionText = require('../lib/cmd-option-text')

var CmdSsh = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer) {
    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.printer = printer

    program
        .command('mount [services...]')
        .description('Create a filesystem mount to the stack services.')
        .option('-i, --identifier <name>', CmdOptionText.identifier)
        .option('-d, --directory <path>', CmdOptionText.directory)
        .action(function (services, cmd) {
            if(services.length) {
                cmd.services = services
            }
            self.action(cmd)
        })
}

CmdSsh.prototype.action = function(cmd) {
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

CmdSsh.prototype.parseOptions = function (options) {
    var data = {}

    if (options.services) {
        data.services = options.services
    }

    if (options.directory) {
        data.directory = options.directory
    }

    return ParseIdentifier(this, options, data)
}

CmdSsh.prototype.do = function(data) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.post('stacks/' + data.identifier + '/mount', data)
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

module.exports = CmdSsh;
