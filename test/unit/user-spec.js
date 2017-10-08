#! /usr/bin/env node
var User = require('../../src/lib/user');
var HayStackServiceAdapter = require('../../src/adapters/haystack-service-adapter');
var assert = require('assert');
var randomstring = require("randomstring");
var sinon = require('sinon');


const cliPath = __dirname + '/index.js';

describe('user', function() {

    var apiAdapter = new HayStackServiceAdapter();
  
    it('user.id set when creating a user', function() {
      var user = new User({apiAdapter: apiAdapter});

      user.email = "test@test.com";
      user.username = "username";
      user.password = "password";

      
      return user.create().then(function(){
        assert(user.id != null, "user.id was not null");
      });

    });

    it('email already has an account', function() {
          
    });

    it('account is created', function() {
          
    });




});

