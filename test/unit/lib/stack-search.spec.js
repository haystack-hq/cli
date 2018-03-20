var StackSearch = require('../../../src/lib/stack-search')
var HayStackServiceAdapter = require('../../../src/adapters/haystack-service-adapter');
var ApiTestAdapter = require('../../../src/adapters/api-test-adapter');
var chai = require('chai');
var expect = chai.expect;

describe('stack search', function () {

    it('responds with empty result', function () {

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: []
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);

        var params = {
            stack_file_location: process.cwd()
        }

        expect(StackSearch(hayStackServiceAdapter, params)).to.eventually.be.length(0)

    })

    it('responds with search result', function () {

        var searchResult = [{
            _id: '768fdec94deb4c3fa1b2344b414f7766',
            identifier: 'test',
            services: [ [Object], [Object] ],
            mode: 'local',
            provider: 'local',
            stack_file_location: '/Users/jaime/gosolid/haystack/haystack-agent/resources/simple-haystack-file/Haystackfile.json',
            status: 'starting',
            health: 'unhealthy',
            created_by: null,
            do_mount: false,
            terminated_on: null,
            haystack_file: { services: [Object] },
            build: { identifier: 'test', objects: [Object] }
        }]

        var apiAdapter = new ApiTestAdapter({
            uri: 'stacks',
            response: searchResult
        })
        var hayStackServiceAdapter = new HayStackServiceAdapter(apiAdapter);

        var params = {
            stack_file_location: process.cwd()
        }

        expect(StackSearch(hayStackServiceAdapter, params)).to.eventually.be.length(1)
        expect(StackSearch(hayStackServiceAdapter, params)).to.eventually.equal(searchResult)

    })

})
