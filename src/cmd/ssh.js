#! /usr/bin/env node
var Promise = require('bluebird');
var colors = require('colors')
const GracefulErrorHandler = require('../lib/graceful-error-handler')
var exec = require('executive')
const ParseIdentifier = require('../lib/parse-identifier')

var CmdSsh = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer){

    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.printer = printer

    program
        .command('ssh <service>')
        .option('-i, --identifier <name>', 'name of your stack. If omitted, the folder name will be used')
        .description('SSH into a service in the stack')
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
