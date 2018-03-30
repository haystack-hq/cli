#! /usr/bin/env node
var CmdPromptAdapter = require('../../../src/adapters/cmd-prompt-adapter');
var InquireTestAdapter = require('../inquirer-test-adapter');
var assert = require('assert');
var sinon = require('sinon');


describe('cmd-prompt-adapter', function() {

    //use a test adapter for the actual prompts.
    var promptAdapter = new CmdPromptAdapter(new InquireTestAdapter());

    var spy = sinon.spy(promptAdapter, "prompt");

    /* begin tests */

    it('should have method ask', function() {
        assert(typeof promptAdapter.ask === "function", "ask method exists");
    });

    it('should NOT prompt if all questions have parameters', function() {

        spy.resetHistory();

        var options = {
            questions: [
                {
                    type: 'input',
                    name: 'test1',
                    message: 'Test1:'
                },
                {
                    type: 'input',
                    name: 'test2',
                    message: 'Test2:'
                }
            ],
            args: { test1: 'test1', test2: 'test2' }
        }

        promptAdapter.ask(options);

        assert(spy.notCalled, 'prompt was not called because all arguments were passed.');

    });


    it('should prompt once if all questions do NOT have parameters', function() {

        spy.resetHistory();

        /* add aanother question where the args are not provided */
        var options = {
            questions: [
                {
                    type: 'input',
                    name: 'test1',
                    message: 'Test1:'
                },
                {
                    type: 'input',
                    name: 'test2',
                    message: 'Test2:'
                }
            ],
            args: { test1: 'test1'}
        }

        promptAdapter.ask(options);

        assert(spy.calledOnce, 'prompt was not called once.');

    });


    it('should prompt once if an arg has a null value', function() {

        spy.resetHistory();

        /* add aanother question where the args are not provided */
        var options = {
            questions: [
                {
                    type: 'input',
                    name: 'test1',
                    message: 'Test1:'
                }
            ],
            args: { test1: null}
        }

        promptAdapter.ask(options);

        assert(spy.calledOnce, 'prompt was called once.');



    });


    it('should have answers that match the args if all args are provided.', function() {

        var options = {
            questions: [
                {
                    type: 'input',
                    name: 'test1',
                    message: 'Test1:'
                },
                {
                    type: 'input',
                    name: 'test2',
                    message: 'Test2:'
                }
            ],
            args: { test1: 'test1', test2: 'test2' }
        }


        return promptAdapter.ask(options).then(function(answers){
            assert(JSON.stringify(Object.keys(answers)) == JSON.stringify(Object.keys(options.args)), "answers match args");

        });
    });


    it('should combine both answers and args into a final array.', function() {

        var options = {
            answers: { test1: 'test1'  },
            args: { test1: 'test1', test2: 'test2' }
        }


        var result = promptAdapter.combineAnswersWithArgs(options.answers, options.args);

        //test to see if there are two keys total
        assert(Object.keys(result).length == 2);

    });







});

