const StackSearch = require('../lib/stack-search')
const Promise = require('bluebird')
const consoleMessages = require('../lib/console-messages')

module.exports = function (handler, options, data) {
    return new Promise(function (resolve, reject) {
        if (!options.identifier) {
            var params = {
                stack_file_location: process.cwd()
            }
            StackSearch(handler.hayStackServiceAdapter, params)
                .then(function (result) {
                    if (result.length) {
                        data.identifier = result[0].identifier

                        resolve(data)
                    }
                    else {
                        reject(consoleMessages.noStackAtLocation)
                    }
                })
                .catch(function (err) {
                    reject(err)
                })
        }
        else {
            data.identifier = options.identifier

            resolve(data)
        }
    })
}
