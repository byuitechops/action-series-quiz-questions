/***********************************************************
 * Grandchild description
 * 
 * Since the matching questions and answers get swapped during
 * Canvas import, this grandchild goes through each quiz 
 * question and checks to see if it is a matching question. 
 * If it is not, it will move on; otherwise, it will go ahead
 * and swap the questions and answers. 
 * 
 * WARNING: Some questions (like upper-level CS courses) have
 * one to many mapping so humans must fix this issue. In order
 * to implement this fix through code, several layers of XML
 * parsing must be done and the time that is to be spent doing
 * that will hold back the whole project.
 ***********************************************************/

//perform a *destructive* deep copy from one array to another
//working example: https://jsfiddle.net/jnpscauo/12/
Array.prototype.clone = function (arr) {
    //benchmarks prove that .splice with zero index is the
    //most efficient way to perform a copy
    //https://jsperf.com/new-array-vs-splice-vs-slice/19
    if (arr instanceof Array) {
        return this.push(arr.splice(0));
    } else if (typeof arr === 'undefined') {
        throw 'ERROR: the array you are trying to clone is undefined.';
    } else {
        throw 'ERROR: ${arr} is not an array.';
    }
}

module.exports = (course, question, callback) => {
    //made for flexibility
    var questionTypes = [
        'matching_question'
    ];

    var validPlatforms = [
        'online'
    ];

    //do not need to do anything if it is not the question
    //we need to work with or the quiz is going to be deleted.
    if (question.techops.delete === true ||
        !questionTypes.includes(question.question_type) ||
        !validPlatforms.includes(course.settings.platform)) {

        callback(null, course, question);
        return;
    } else {
        beginProcess();
        callback(null, course, question);
    }

    /************************************************************
     * beginProcess
     * 
     * This function acts as a driver for the grandchild. It 
     * determines whether the question is a question that we need
     * to work with. If it does, it investigates further and 
     * calls the appropriate function to apply the fix to.
     ************************************************************/
    function beginProcess() {
        var isMultipleAnswersSame = false;      //for logging purposes. 
        var answersArray = [];                  // for answers array object in QuizQuestion
        var matchingArray = [];                 // array of objects for QuizQuestion
        var avoidDuplicateQuestions = [];       //create this here so we don't lose the data we get
        var distractors = '';                   // string for all incorrect answers in the dropdown

        //checking through the answers object
        question.answers.forEach(answer => {
            //don't want to create a question when there is no question 
            //this applies to questions that has more answers than questions
            if (typeof answer.right === 'undefined') {
                distractors += `${answer.left}\n`;
            } else {
                //determine if the question is a one-to-one or one-to-many mapping
                //for answers to questions
                if (question.answers.length < question.matches.length) {
                    isMultipleAnswersSame = true;
                    var multipleArrays = multipleSameAnswer(answer, avoidDuplicateQuestions);

                    answersArray.clone(multipleArrays[0]);
                    matchingArray.clone(multipleArrays[1]);
                    distractors += multipleArrays[2];

                } else {
                    var uniqueArrays = uniqueAnswer(answer);

                    answersArray.clone(uniqueArrays[0]);
                    matchingArray.clone(uniqueArrays[1]);
                    distractors += uniqueArrays[2];
                }
            }
        });

        //throw warning so humans can check out the quiz to ensure that there is no bugs and make sure 
        //that all of the answers for the questions are correct.
        if (isMultipleAnswersSame) {
            question.techops.warning('Multiple questions have the same answer. All of the questions and answers has been swapped. Due to various reasons, the answers may not match. It is best that you check through the quiz.');
        }

        //flatten array and prep the question object for Canvas injection
        question.answers = [].concat(...answersArray);
        question.matching = [].concat(...matchingArray);
        question.matching_answer_incorrect_matches = distractors;

        //logging for report
        question.techops.log('Quiz Question Swapping', {
            'ID': question.id,
            'Title': question.question_name
        });

        return;
    }

    /************************************************************
     * uniqueAnswer
     * 
     * @param answer - array object
     * 
     * This function handles the questions in which each question
     * has an unique answer, meaning that there is an one-to-one
     * mapping for each answer to each question.
     ************************************************************/
    function uniqueAnswer(answer) {
        var distractors = '';       //the items the dropdown will be populated with
        var answersArray = [];      //array of all answers for QuizQuestion object
        var matchingArray = [];     //array of objects for quizQuestion

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

    /************************************************************
     * multipleSameAnswer
     * 
     * @param answer - array object
     * @param avoidDuplicateQuestions - array of strings
     * 
     * This function handles the questions where there are multiple
     * questions with the same answer. In order to find all of the 
     * correct matches, the XML for a specific quiz must be parsed.
     ************************************************************/
    function multipleSameAnswer(answer, avoidDuplicateQuestions) {
        var distractors = '';       //the items the dropdown will be populated with
        var distractorsArray = [];  //array consisting of ALL distractors
        var answersArray = [];      //array of all answers for QuizQuestion object
        var matchingArray = [];     //array of objects for quizQuestion

        //prepare the dropdown to be populated with all of the answers
        //so this goes through and gets them all 
        question.answers.filter(theAnswer => {
            //need to avoid duplicate answers as this will throw students off
            if (!distractorsArray.includes(theAnswer.left)) {
                distractors += `${theAnswer.left}\n`;
                distractorsArray.push(theAnswer.left);
            }
        });

        //go through each matches and begins the swapping
        for (let index in question.matches) {
            //don't want duplicate questions
            //this also handles the questions where there are more answers than questions
            if (!avoidDuplicateQuestions.includes(question.matches[index].text) &&
                typeof question.matches[index].text != 'undefined') {
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
