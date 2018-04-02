var ParseIdentifier = require('../../../src/lib/parse-identifier')
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var ApiTestAdapter = require('../api-test-adapter');
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var consoleMessages = require('../../../src/lib/console-messages')

describe('parse-identifier', function () {
    var response = [{
        "identifier": "tester",
    }]

    it('should return the identifier when passed as an option without querying the daemon', function () {
        var options = {
            identifier: 'tester'
        }

        expect(ParseIdentifier({}, options, {})).to.eventually.deep.equal(options)
    })

    it('should go get the identifier when not passed', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: response
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var handler = {
            hayStackServiceAdapter: hayStackServiceAdapter
        }

        expect(ParseIdentifier(handler, {}, {})).to.eventually.deep.equal({identifier: 'tester'})
    })

    it('should reject with no stack found at this location message', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: []
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var handler = {
            hayStackServiceAdapter: hayStackServiceAdapter
        }

        expect(ParseIdentifier(handler, {}, {})).to.be.rejectedWith(consoleMessages.noStackAtLocation)
    })

    it('should reject with specific error', function () {
        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            error: 'an error'
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);
        var handler = {
            hayStackServiceAdapter: hayStackServiceAdapter
        }

        expect(ParseIdentifier(handler, {}, {})).to.be.rejectedWith('an error')
    })
})
