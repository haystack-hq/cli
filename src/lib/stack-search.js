var Promise = require('bluebird')

module.exports = function (serviceAdapter, data) {
    return new Promise(function(resolve, reject) {
        serviceAdapter.post('stacks/search', data)
            .then(function (result) {
                resolve(result)
            })
            .catch(function (err) {
                reject(err)
            })
    })
}
