var Printer = function(output) {
    this.output = output
}

Printer.prototype.print = function (message, params) {
    var self = this

    if (params) {
        message = replaceParams(message, params)
    }

    if ( ! self.output) {
        console.log(message)
    }
    else {
        self.output(message)
    }
}

var replaceParams = function (message, params) {
    params.forEach(function (value, key) {
        message = message.replace(new RegExp("\\{" + key + "\\}", "g"), value);
    })

    return message;
}

module.exports = Printer
