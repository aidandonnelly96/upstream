AIMLInterpreter = require('./AIMLInterpreter');
var aimlInterpreter = new AIMLInterpreter({name:'MuBot', age:'42'});
aimlInterpreter.loadAIMLFilesIntoArray(['./answer.xml']);
var callback = function(answer, wildCardArray, input){
console.log(answer + ' | ' + wildCardArray + ' | ' + input);
};

var findanswer=function(){
	console.log("hello world");
	aimlInterpreter.findAnswerInLoadedAIMLFiles('What is your name?', callback);
};
