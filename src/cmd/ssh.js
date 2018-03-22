#! /usr/bin/env node
var Promise = require('bluebird');
var Table = require('cli-table')
var colors = require('colors')
var consoleMessages = require('../lib/console-messages')
const GracefulErrorHandler = require('../lib/graceful-error-handler')
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

    // console.log(cmd)

    exec('docker exec -it ' + cmd.service + ' /bin/sh')

    // this.do(cmd)
    //     .then(function (result) {
    //         self.printer.print(result);
    //     })
    //     .catch(function (err){
    //         if (err.errno === 'no-stacks') {
    //             self.printer.print(err.message)
    //         }
    //         else {
    //             GracefulErrorHandler(self.printer, err)
    //         }
    //     });
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

CmdSsh.prototype.parseOptions = function (options) {
    var self = this

    return new Promise(function (resolve, reject) {
        var data = {}

        if( ! options.identifier) {
            var params = {
                stack_file_location: process.cwd()
            }
            StackSearch(self.hayStackServiceAdapter, params)
                .then(function (result) {
                    if(result.length) {
                        data = {
                            identifier: result[0].identifier
                        }

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
            data = {
                identifier: options.identifier
            }

            resolve(data)
        }
    })
}

CmdSsh.prototype.do = function(options) {
    var self = this;

    var table = new Table({
        head: ['identifier', 'provider', 'status', 'health'],
        style: {
            head: ['bold']
        }
    })

    return new Promise(function (resolve, reject) {

        self.getStacks(options)
            .then(function (result) {
                // add each stack from the result to the table
                result.forEach(function (stack) {
                    table.push([
                        stack.identifier,
                        stack.provider ? stack.provider : 'local',
                        stack.status,
                        stack.health
                    ])
                })

                resolve(table.toString())
            })
            .catch(function (err) {
                reject(err)
            })

    })

}

CmdSsh.prototype.getStacks = function (options) {

    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.get('stacks')
            .then(function (result) {
                if (result.length) {
                    resolve(result)
                }
                else {
                    reject({errno: 'no-stacks', message: 'There are currently no stacks running.'})
                }
            })
            .catch(function (err) {
                reject(err)
            })
    })

}

module.exports = CmdSsh;
