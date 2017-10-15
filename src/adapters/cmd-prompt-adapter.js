#! /usr/bin/env node
var Promise = require("bluebird");


var CmdPromptAdapter = function(inquirer){
	this.inquirer = inquirer;
}

CmdPromptAdapter.prototype.ask = function(options){
	var self = this;

	return new Promise(function(resolve, reject){

		var questions = options.questions;
		var args = options.args;


		var answers = {};
		var prompts = [];


		//remove questions that we have answers for.
		var finalQuestions = [];
		for (var k = 0; k < questions.length; k++){

			var key = questions[k].name
			var question = questions[k];

			//if the arg does not exists by key or is emtpy.
			if(args == null || Object.keys(args).indexOf(key) < 0 )
			{
                finalQuestions.push(question);
			}
			else if(Object.keys(args).indexOf(key) >= 0 && (args[key] == null ||args[key].length == 0) )
			{
                finalQuestions.push(question);
			}


		}
		

		//prompt
		if(finalQuestions.length > 0)
		{
            self.prompt(finalQuestions, args).then(function(answers){
                resolve(answers);
            });
		}
		else
		{
			resolve(args);
		}
	
		
	});
}

CmdPromptAdapter.prototype.prompt = function(questions, args){
	var self = this;

    return new Promise(function(resolve, reject) {
        self.inquirer.prompt(questions).then(function (answers) {

        	//add in the args
            var finalAnswers = self.combineAnswersWithArgs(answers, args);

            //then resolve with answers
			resolve(finalAnswers);
        });
    });

}


CmdPromptAdapter.prototype.combineAnswersWithArgs = function(answers, args) {

	for (a in args) {
        answers[a] = args[a];

    }

    return answers;
}

module.exports = CmdPromptAdapter;