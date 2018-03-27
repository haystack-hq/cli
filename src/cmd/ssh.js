#! /usr/bin/env node
var Promise = require('bluebird');
var Table = require('cli-table')
var colors = require('colors')
var consoleMessages = require('../lib/console-messages')
const GracefulErrorHandler = require('../lib/graceful-error-handler')
const StackSearch = require('../lib/stack-search')
var exec = require('executive')

var CmdSsh = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer){

    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.printer = printer

    program
        .command('ssh')
        .option('-i, --identifier <name>', 'name of your stack. If omitted, the folder name will be used')
        .option('-s, --service [name]', 'name of the service.')
        .description('SSH into a container in the stack')
        .action(function (cmd) {
            self.action(cmd)
        })

}

CmdSsh.prototype.action = function(cmd) {
    var self = this

    //exec('docker exec -it ' + cmd.service + ' /bin/sh')

    this.do(cmd)
        .then(function (result) {
            exec(result.cmd)
        })
        .catch(function (err){
            GracefulErrorHandler(self.printer, err)
        });

}

CmdSsh.prototype.parseOptions = function (options) {
    var self = this

    return new Promise(function (resolve, reject) {
        var data = {
            service: options.service,
            new_terminal: false
        }

        if( ! options.identifier) {
            var params = {
                stack_file_location: process.cwd()
            }
            StackSearch(self.hayStackServiceAdapter, params)
                .then(function (result) {
                    if(result.length) {
                        data.identifier = result[0].identifier

                        resolve(data)
                    }
                    else {
                        reject('No stack found at this location')
                    }
                })
                .catch(function (err) {
                    reject(err)
                })
        }
        else if (options.identifier && typeof options.identifier === 'string') {
            data.identifier = options.identifier

            resolve(data)
        }
    })
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
