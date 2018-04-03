var DaemonAdapter = require('../../../src/adapters/daemon-adapter');
var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var axios = require('axios')
var moxios = require('moxios')
var sinon = require('sinon')

describe('daemon-adapter', function() {
    beforeEach(function () {
        // import and pass your custom axios instance to this method
        moxios.install()
    })

    afterEach(function () {
        // import and pass your custom axios instance to this method
        moxios.uninstall()
    })

    it('should fail newing up without uri passed', function () {
        expect(function() {
            new DaemonAdapter({})
        }).to.throw(Error, "Daemon adapter missing 'uri' option.")
    })

    it('should fail to do request to url that doesn\'t respond', function () {
        var options = {
            uri: 'test'
        }
        var daemon = new DaemonAdapter(options)


        expect(daemon.request({}, 'stacks', 'get'))
            .to.be.rejectedWith('Request failed with status code 400')
    })

    it('should succeed to do request', function (done) {
        var onFulfilled = sinon.spy()
        var options = {
            uri: 'test'
        }
        var daemon = new DaemonAdapter(options)
        daemon.request({}, 'stacks', 'get', {}).then(onFulfilled)

        moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: [
                    { identifier: 'hello' },
                    { identifier: 'test' }
                ]
            }).then(function () {
                expect(onFulfilled.called).to.equal(true)
                expect(onFulfilled.getCall(0).args[0]).to.deep.equal([
                    { identifier: 'hello' },
                    { identifier: 'test' }
                ])

                done()
            })
        })
    })
});

