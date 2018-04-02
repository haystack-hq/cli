var Printer = require('../../../src/lib/printer')
var chai = require('chai');
var expect = chai.expect;

describe('printer', function () {
    it('should replace params like {0}, {1}, etc.', function () {
        var string = '{0} is {1} test {2}'

        var result = ''
        var printer = new Printer(function (message) {
            result = message
        })

        printer.print(string, ['this', 'a', 'string'])

        expect(result).to.equal('this is a test string')
    })

    it('should not replace anything when string doesn\'t have', function () {
        var string = 'string should remain the same'

        var result = ''
        var printer = new Printer(function (message) {
            result = message
        })

        printer.print(string, ['this', 'a', 'string'])

        expect(result).to.equal('string should remain the same')
    })

    it('should keep the string when no params passed to the print method', function () {
        var string = 'string should remain the same'

        var result = ''
        var printer = new Printer(function (message) {
            result = message
        })

        printer.print(string)

        expect(result).to.equal('string should remain the same')
    })
})
