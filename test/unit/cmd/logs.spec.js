#! /usr/bin/env node
var CmdPromptAdapter = require('../../../src/adapters/cmd-prompt-adapter');
var InquireTestAdapter = require('../../../src/adapters/inquirer-test-adapter');
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var ApiTestAdapter = require('../../../src/adapters/api-test-adapter');
var CmdLogs = require('../../../src/cmd/logs');
var program = require('commander');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Printer = require('../../../src/lib/printer')
var colors = require('colors');
const Table = require('cli-table2')
const capitalize = require('capitalize')

describe('cmd-info', function () {

    var printer = new Printer()
    var cmdPromptAdapter = new CmdPromptAdapter(new InquireTestAdapter());
    var response = [
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere voluptas quis, rem eius, nihil rerum minus! Libero quaerat quibusdam ut praesentium exercitationem, facilis id in. Nesciunt mollitia in accusamus odit.',
    'Tenetur magnam consequuntur, repellendus soluta natus, eum! Asperiores atque quidem illum quaerat possimus, veritatis! Optio quis dolor officiis iusto, esse, temporibus deserunt quisquam aliquam veritatis quae deleniti dicta illo error!',
    'Voluptatum nesciunt dolore sunt nam, libero eligendi necessitatibus facilis cum quos. Ipsam quisquam labore, omnis, voluptatibus quod quae et distinctio mollitia delectus magnam nam illum dolore maiores, reiciendis odit ex!',
    'Explicabo deserunt magni, ducimus minus fugiat ullam nulla, reprehenderit ratione cum sequi tenetur, sit quibusdam doloremque! Consectetur tempora expedita rerum ea, laudantium similique a aspernatur illo fuga nobis cupiditate, labore.',
    'Itaque sed aut rerum. Rerum veritatis iusto officia omnis, nulla quidem soluta sunt veniam a, laboriosam aliquid voluptatibus cumque! Vel unde, incidunt inventore dolorem enim dolorum. Tempora eaque, assumenda perferendis.'
    ]

    it('should return all the response data', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdLogs = new CmdLogs(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        data = {
            identifier: 'test',
            service: 'web_1'
        }

        expect(cmdLogs.do(data)).to.eventually.equal(response)
    })

    it('should print the received data', function () {
        var messages = []

        printer = new Printer(function (message) {
            messages.push(message)
        })

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var cmdLogs = new CmdLogs(program, hayStackServiceAdapter, cmdPromptAdapter, printer);

        cmdLogs.printLogs(response)

        expect(messages).to.deep.equal(response)
    })

})
