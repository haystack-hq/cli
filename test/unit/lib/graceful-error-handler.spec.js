var GracefulErrorHandler = require('../../../src/lib/graceful-error-handler')
var Printer = require('../../../src/lib/printer')
var consoleMessages = require('../../../src/lib/console-messages')
var colors = require('colors')
var chai = require('chai');
var expect = chai.expect;

describe('graceful-error-handler', function () {
    it('should print specific errors when daemon not running', function () {
        var messages = []
        var printer = new Printer(function (message) {
            messages.push(message)
        })
        var err = {
            errno: 'ECONNREFUSED',
            port: 1234
        }

        var expected = [
            consoleMessages.haystackNotRunning,
            colors.red('ECONNREFUSED on port 1234.')
        ]

        GracefulErrorHandler(printer, err)

        expect(messages).to.deep.equal(expected)
    })

    it('should print specific errors when err.response has err.response.data is present in the error', function () {
        var messages = []
        var printer = new Printer(function (message) {
            messages.push(message)
        })
        var err = {
            response: {
                data: 'message data'
            }
        }

        var expected = [
            colors.red('message data')
        ]

        GracefulErrorHandler(printer, err)

        expect(messages).to.deep.equal(expected)
    })

    it('should print specific error as regular text when type info passed', function () {
        var messages = []
        var printer = new Printer(function (message) {
            messages.push(message)
        })
        var err = {
            type: 'info',
            message: 'info message'
        }

        var expected = [
            'info message'
        ]

        GracefulErrorHandler(printer, err)

        expect(messages).to.deep.equal(expected)
    })

    it('should print error as red text when all other checks don\'t match', function () {
        var messages = []
        var printer = new Printer(function (message) {
            messages.push(message)
        })
        var err = 'there was an error'

        var expected = [
            colors.red('there was an error')
        ]

        GracefulErrorHandler(printer, err)

        expect(messages).to.deep.equal(expected)
    })
})
