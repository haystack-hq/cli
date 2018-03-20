#! /usr/bin/env node
var Promise = require('bluebird');
var Table = require('cli-table')
var colors = require('colors')
var consoleMessages = require('../lib/console-messages')


var CmdList = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer){

    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.printer = printer

    program
        .command('list')
        .alias('ls')
        .usage(' ')
        .description('List active stacks')
        .action(function (cmd) {
            self.action(cmd)
        })

}

CmdList.prototype.action = function(cmd) {
    var self = this

    this.do(cmd)
        .then(function (result) {
            self.printer.print(result);
        })
        .catch(function (err){
            if (err.errno === 'ECONNREFUSED') {
                self.printer.print(consoleMessages.haystackNotRunning)
                self.printer.print(colors.red(err.errno + ' on port ' + err.port + '.'))
            }
            else {
                self.printer.print(colors.red(err))
            }
        });

}

CmdList.prototype.do = function(options) {
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
                        stack.provider,
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

CmdList.prototype.getStacks = function (options) {

    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.get('stacks')
            .then(function (result) {
                if (result.length) {
                    resolve(result)
                }
                else {
                    reject('There are no stacks currently running.')
                }
            })
            .catch(function (err) {
                reject(err)
            })
    })

}

module.exports = CmdList;
