#! /usr/bin/env node
var Promise = require('bluebird');
var Validator = require('../lib/validator');
var colors = require('colors');

var CmdStart = function(program, hayStackServiceAdapter, cmdPromptAdapter){

    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.validator = new Validator();

    program
        .command('start')
        .description('Launch a stack')
        .option('-i, --identifier <name>', 'name of your stack. If omitted, the folder name will be used')
        .option('-x, --exclude-mount', 'no file system mounts to the stack will be created')
        .action(function (cmd) {
            self.action(cmd)
        })

}

CmdStart.prototype.action = function(cmd) {

    this.do(cmd)
        .then(function (result) {
            colors.green('Your stack is starting...')
        })
        .catch(function (err){
            console.log(err)
        });

}

CmdStart.prototype.do = function(options) {
    var self = this;

    return new Promise(function (resolve, reject) {

        var data = self.parseOptions(options)

        // start the stack
        self.startStack(data)
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

CmdStart.prototype.parseOptions = function (options) {
    // default data
    var data = {
        directory: process.cwd(),
        mount: true
    }

    // identifier flag with string
    if (options.identifier && typeof options.identifier === 'string') {
        data.identifier = options.identifier
    }

    // disabling mount
    if (options.excludeMount) {
        data.mount = false
    }

    return data
}

CmdStart.prototype.startStack = function (data) {

    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.post('stacks', data)
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })

}

module.exports = CmdStart;
