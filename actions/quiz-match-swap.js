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
    }

    function beginProcess() {
        var isMultipleAnswersSame = false;
        var distractorsArray = [];
        var answersArray = [];          // for answers array object in QuizQuestion
        var matchingArray = [];         // array of objects for QuizQuestion
        var distractors = '';           // string for all incorrect answers in the dropdown

        question.answers.forEach(answer => {
            if (answer.right === null) {
                distractors += `${answer.left}\n`;
            } else {
                
            }
        });
    }
}