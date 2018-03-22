const consoleMessages = require('../lib/console-messages')
const colors = require('colors')

module.exports = function(printer, err) {
    if (err.errno === 'ECONNREFUSED') {
        printer.print(consoleMessages.haystackNotRunning)
        printer.print(colors.red(err.errno + ' on port ' + err.port + '.'))
    }
    else if (err.response && err.response.data) {
        printer.print(colors.red(err.response.data))
    }
    else {
        printer.print(colors.red(err))
    }
}