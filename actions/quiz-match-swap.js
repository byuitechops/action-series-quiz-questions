//perform a *destructive* deep copy from one array to another
//working example: https://jsfiddle.net/jnpscauo/12/
Array.prototype.clone = function (arr) {
    //benchmarks prove that .splice with zero index is the
    //most efficient way to perform a copy
    //https://jsperf.com/new-array-vs-splice-vs-slice/19
    if (arr instanceof Array) {
        return this.push(arr.splice(0));
    } else if (typeof arr === "undefined") {
        throw "ERROR: the array you are trying to clone is undefined.";
    } else {
        throw "ERROR: ${arr} is not an array.";
    }
}

module.exports = (course, question, callback) => {
    var questionTypes = [
        'matching_question'
    ];

    if (question.techops.delete === true ||
        !questionTypes.includes(question.question_type)) {

        callback(null, course, question);
        return;
    } else {
        beginProcess();
        callback(null, course, question);
    }

    function beginProcess() {
        course.message(`Identified matching quiz question.`);

        var isMultipleAnswersSame = false;
        var answersArray = [];          // for answers array object in QuizQuestion
        var matchingArray = [];         // array of objects for QuizQuestion
        var avoidDuplicateQuestions = [];        
        var distractors = '';           // string for all incorrect answers in the dropdown

        question.answers.forEach(answer => {
            console.log(`ANSWERS: ${JSON.stringify(answer)}`);
            if (answer.right === null) {
                distractors += `${answer.left}\n`;
            } else {
                if (question.answers.length < question.matches.length) {
                    isMultipleAnswersSame = true;
                    multipleArrays = multipleSameAnswer(answer, avoidDuplicateQuestions);

                    console.log(`MULTIPLE: ${JSON.stringify(multipleArrays)}`);

                    answersArray.clone(multipleArrays[0]);
                    matchingArray.clone(multipleArrays[1]);
                    distractors += multipleArrays[2];
                } else {
                    uniqueArrays = uniqueAnswer(answer);

                    console.log(`UNIQUE: ${JSON.stringify(uniqueArrays)}`);

                    answersArray.clone(uniqueArrays[0]);
                    matchingArray.clone(uniqueArrays[1]);
                    distractors += uniqueArrays[2];
                }
            }
        });

        if (isMultipleAnswersSame) {
            //throw warning so humans can check out the quiz to ensure that there is no bugs and make sure 
            //that all of the answers for the questions are correct.
            course.warning(`Multiple questions have the same answer. All of the questions and answers has been swapped. Due to various reasons, the answers may not match. It is best that you check through the quiz.`);
        }

        question.answers = answersArray[0];
        question.matching = matchingArray[0];
        question.matching_answer_incorrect_matches = distractors;

        course.log(`Quiz Question Swapping`, {
            'ID': question.id,
            'Title': question.question_name
        });

        return;
    }

    function uniqueAnswer(answer) {
        var distractors = '';
        var distractorsArray = [];
        var answersArray = [];
        var matchingArray = [];

        answersArray.push({
            'answer_text': answer.text,
            'id': answer.id,
            'answer_match_left': answer.right,
            'answer_match_right': answer.left
        });

        matchingArray.push({
            'match_id': answer.match_id,
            'text': answer.left
        });

        distractors += `${answer.left}\n`;

        return [answersArray, matchingArray, distractors];
    }

    function multipleSameAnswer(answer, avoidDuplicateQuestions) {
        var distractors = '';
        var distractorsArray = [];        
        var answersArray = [];
        var matchingArray = [];

        question.answers.filter(theAnswer => {
            if (!distractorsArray.includes(theAnswer.left)) {
                distractors += `${atheAnswernswer.left}\n`;
                distractorsArray.push(theAnswer.left);
            }
        });

        for (index in question.matches) {
            if (!avoidDuplicateQuestions.includes(question.matches[index].text)) {
                answersArray.push({
                    'answer_text': answer.text,
                    'id': answer.id,
                    'answer_match_left': question.matches[index].text,
                    'answer_match_right': answer.left
                });

                matchingArray.push({
                    'match_id': answer.match_id,
                    'text': answer.left
                });

                avoidDuplicateQuestions.push(question.matches[index].text);
            }
        }

        return [answersArray, matchingArray, distractors]; 
    }
}