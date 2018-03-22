#! /usr/bin/env node
var Promise = require('bluebird');
var Table = require('cli-table')
var colors = require('colors')
var consoleMessages = require('../lib/console-messages')
const GracefulErrorHandler = require('../lib/graceful-error-handler')

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
            if (err.errno === 'no-stacks') {
                self.printer.print(err.message)
            }
            else {
                GracefulErrorHandler(self.printer, err)
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

CmdList.prototype.getStacks = function (options) {

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

module.exports = CmdList;
