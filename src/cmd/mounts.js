#! /usr/bin/env node
const Promise = require('bluebird')
var Table = require('cli-table2')
const colors = require('colors')
const GracefulErrorHandler = require('../lib/graceful-error-handler')

var CmdMounts = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer) {
    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.printer = printer

    program
        .command('mounts')
        .description('List filesystem mounts.')
        .usage(' ')
        .action(function (cmd) {
            self.action(cmd)
        })
}

CmdMounts.prototype.action = function(cmd) {
    var self = this

    this.do(cmd)
        .then(function (result) {
            self.printer.print(result)
        })
        .catch(function (err) {
            GracefulErrorHandler(self.printer, err)
        })
}

CmdMounts.prototype.do = function(data) {
    var self = this;

    return new Promise(function(resolve, reject) {
        self.getStacks(data)
            .then(function (result) {
                var table = new Table({
                    head: ['identifier', 'service', 'local path', 'service path'],
                    style: {
                        head: ['bold']
                    }
                })

                // add each stack from the result to the table
                result.forEach(function (stack) {
                    table.push([
                        stack.identifier
                    ])
                })

                resolve(table.toString())
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

CmdMounts.prototype.getStacks = function (options) {
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

module.exports = CmdMounts;
