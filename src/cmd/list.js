#! /usr/bin/env node
var Promise = require('bluebird');
var Validator = require('../lib/validator');
var Table = require('cli-table')


var CmdList = function(program, hayStackServiceAdapter, cmdPromptAdapter){

    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.validator = new Validator();

    program
        .command('list')
        .alias('ls')
        .description('List active stacks')
        .option('-a, --all', 'list all stacks, including stacks created by other team members')
        .action(function (cmd) {
            self.action(cmd)
        })

}

CmdList.prototype.action = function(cmd) {

    this.do(cmd)
        .then(function (result) {
            console.log(result);
        })
        .catch(function (err){
            console.log(err)
        });

}

CmdList.prototype.do = function(options) {
    var self = this;

    var table = new Table({
        head: ['id', 'provider', 'status', 'health']
    })

    return new Promise(function (resolve, reject) {

        self.getStacks(options)
            .then(function (result) {
                // add each result to the table
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

// should return a promise
CmdList.prototype.getStacks = function (options) {

    var self = this;

    var data = {}
    if (options.all) {
        data.all = true
    }

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.get('stacks', data)
            .then(function (result) {
                if (result.length) {
                    resolve(result)
                }
                else {
                    reject('No stacks found.')
                }
            })
            .catch(function (err) {
                reject(err)
            })
    })

}

module.exports = CmdList;
