#! /usr/bin/env node
const Promise = require('bluebird');
const colors = require('colors')
const GracefulErrorHandler = require('../lib/graceful-error-handler')
const exec = require('executive')
const ParseIdentifier = require('../lib/parse-identifier')
const CmdOptionText = require('../lib/cmd-option-text')

var CmdSsh = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer) {
    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.printer = printer

    program
        .command('ssh <service>')
        .description('SSH into a service in the stack')
        .option('-i, --identifier <name>', CmdOptionText.identifier)
        .action(function (service, cmd) {
            cmd.service = service

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
            exec(result.cmd)
        })
        .catch(function (err) {
            GracefulErrorHandler(self.printer, err)
        })
}

CmdSsh.prototype.parseOptions = function (options) {
    var data = {
        service: options.service,
        new_terminal: false
    }

    return ParseIdentifier(this, options, data)
}

CmdSsh.prototype.do = function(options) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.post('stacks/' + options.identifier + '/ssh', options)
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

module.exports = CmdSsh;
