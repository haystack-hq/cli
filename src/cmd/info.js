#! /usr/bin/env node
var Promise = require('bluebird');
var Validator = require('../lib/validator');
var Spinner = require('cli-spinner').Spinner;
const colors = require('colors')
const Table = require('cli-table')
const capitalize = require('capitalize')
const consoleMessages = require('../lib/console-messages')
const StackSearch = require('../lib/stack-search')
const GracefulErrorHandler = require('../lib/graceful-error-handler')

var CmdInfo = function(program, hayStackServiceAdapter, cmdPromptAdapter, printer){

    var self = this;
    this.hayStackServiceAdapter = hayStackServiceAdapter;
    this.cmdPromptAdapter = cmdPromptAdapter;
    this.validator = new Validator();
    this.printer = printer

    program
        .command('info')
        .description('Information about stack')
        .option('-i, --identifier <name>', 'name of stack. If omitted, the stack from the current folder will be used')
        .action(function (cmd) {
            self.action(cmd)
        })

}

CmdInfo.prototype.action = function(cmd) {

    var self = this

    this.do(cmd)
        .then(function (result) {
            self.printInfo(result)
        })
        .catch(function (err){
            GracefulErrorHandler(self.printer, err)
        });
}

CmdInfo.prototype.do = function(options) {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.parseOptions(options)
            .then(function (result) {
                // start the stack
                return self.getInfo(result)
            })
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}

CmdInfo.prototype.parseOptions = function (options) {
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
                        var rejection = {
                            type: 'info',
                            message: 'No stack found at this location. Please provide the stack identifier with the -i option.'
                        }
                        reject(rejection)
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

CmdInfo.prototype.getInfo = function (data) {

    var self = this;

    return new Promise(function(resolve, reject) {
        self.hayStackServiceAdapter.get('stacks/' + data.identifier)
            .then(function (result) {
                if (Object.keys(result).length) {
                    resolve(result)
                }
                else {
                    reject({ message: consoleMessages.haystackNotRunning })
                }
            })
            .catch(function (err) {
                reject(err)
            })
    })

}

CmdInfo.prototype.printInfo = function (result) {

    var self = this

    // title
    self.printer.print(colors.underline('Stack information'))

    var table = new Table({
        chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
            , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
            , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
            , 'right': '' , 'right-mid': '' , 'middle': ' ' },
        style: { 'padding-left': 0, 'padding-right': 0 }
    });

    // identifier
    table.push(['Identifier:', result.identifier])
    // status
    table.push(['Status:', capitalize(result.status)])
    // health
    table.push(['Health:', capitalize(result.health)])
    // services
    table.push(['Services:', result.services.length])

    self.printer.print(table.toString())

    // single services
    result.services.forEach(function (service, key) {
        self.printer.print(service.name + ' service:')

        table = new Table({
            chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
                , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
                , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
                , 'right': '' , 'right-mid': '' , 'middle': ' ' },
            style: { 'padding-left': 1, 'padding-right': 0 }
        });

        table.push(['', 'Status:', capitalize(service.status)])
        table.push(['', 'Exists:', self.boolToString(service.exists)])
        table.push(['', 'Running:', self.boolToString(service.is_running)])
        table.push(['', 'Provisioned:', self.boolToString(service.is_provisioned)])
        table.push(['', 'Healthy:', self.boolToString(service.is_healthy)])

        self.printer.print(table.toString())
    })
}

CmdInfo.prototype.boolToString = function (bool) {
    if (bool) {
        return 'Yes'
    }

    return 'No'
}

module.exports = CmdInfo;
