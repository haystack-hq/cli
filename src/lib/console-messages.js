var colors = require('colors');

module.exports = {
    pending: colors.yellow('{0} is pending...'),
    starting: colors.green('{0} stack is starting...'),
    provisioning: colors.yellow('{0} stack is provisioning...'),
    running: colors.green('{0} stack is running!'),
    stopping: colors.yellow('{0} stack is stopping...'),
    stopped: colors.green('{0} stack has been stopped.'),
    impaired: colors.red("Something went wrong when launching {0} stack and it's not fully functional."),
    terminating: colors.yellow('{0} stack is terminating...'),
    terminated: colors.green('{0} stack has been terminated.'),
    serviceIs: '{0} service is {1}',
    serviceHasBeen: '{0} service has been {1}',
    noAgent: 'Could not connect to the agent. Is it running?'
}