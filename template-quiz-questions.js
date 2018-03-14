/* Dependencies */
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

/* Actions */
var actions = [
    require('./actions/quiz-questions-delete.js'),
    require('./actions/quiz-match-swap.js'),
];

class TechOps {
    constructor() {
        this.getHTML = getHTML;
        this.setHTML = setHTML;
        this.getPosition = getPosition;
        this.setPosition = setPosition;
        this.getTitle = getTitle;
        this.setTitle = setTitle;
        this.getID = getID;
        this.delete = false;
        this.type = 'Quiz Question';
    }
}

/********************************************************
 *  BETA: This API resource is not finalized, and there 
 * could be breaking changes before its final release. 
 ********************************************************/

/* Retrieve all items of the type */
function getItems(course, callback) {
    var quizQuestions = [];
    var quizList = [];

    /* Get all of the quiz questions from Canvas */
    function getQuizQuestions(quiz, eachCallback) {
        canvas.getQuizQuestions(course.info.canvasOU, quiz.id, (eachErr, items) => {
            if (eachErr) {
                course.error(eachErr);
                eachCallback(null);
                return;
            }
            /* Add on the quiz questions to our growing list */
            quizQuestions = quizQuestions.concat(items);
            eachCallback(null);
        });
    }

    /* Get all of the quizzes */
    canvas.getQuizzes(course.info.canvasOU, (err, quizzes) => {
        if (err) {
            callback(err);
            return;
        }

        quizList = quizzes;

        /* For each quiz, get the quiz questions */
        asyncLib.each(quizzes, getQuizQuestions, (err) => {
            if (err) {
                course.error(err);
            }

            /* Give each item the TechOps helper class */
            quizQuestions.forEach(item => {
                item.techops = new TechOps();
            });

            callback(null, quizQuestions);
        });
    });
}

/* Build the PUT object for an item */
function buildPutObj(question) {
    var obj = {
        'quiz_id': question.quiz_id, // required
        'id': question.id, // required
        'question': {
            'question_name': question.question_name,
            'question_text': question.question_text,
            'question_type': question.question_type,
            'position': question.position,
            'points_possible': question.points_possible,
            'correct_comments': question.correct_comments,
            'incorrect_comments': question.incorrect_comments,
            'neutral_comments': question.neutral_comments,
            'answers': question.answers,
        }
    };

    if (question.question_type === 'matching_question' &&
        question.matching &&
        question.matching_answer_incorrect_matches) {

            obj.question.matching = question.matching;
            obj.question.matching_answer_incorrect_matches = question.matching_answer_incorrect_matches;
    }

    console.log(`OBJ: ${JSON.stringify(obj)}`);

    return obj; 
}

/****** BETA: This API endpoint is not finalized, and there could be breaking changes before its final release. - Canvas API Documentation ******/
function deleteItem(course, question, callback) {
    canvas.delete(`/api/v1/courses/${course.info.canvasOU}/quizzes/${question.techops.quiz_id}/questions/${question.id}`, (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, null);
    });
}

/* PUT an item back into Canvas with updates */
function putItem(course, question, callback) {
    if (question.techops.delete === true) {
        deleteItem(course, question, callback);
        return;
    }
    var putObj = buildPutObj(question);
    canvas.put(`/api/v1/courses/${course.info.canvasOU}/quizzes/${question.quiz_id}/questions/${question.id}`, putObj, (err, newItem) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, newItem);
    });
}

function getHTML(item) {
    return null;
}

function setHTML(item, newHTML) {
    return null;
}

function getTitle(item) {
    return item.question_name;
}

function setTitle(item, newTitle) {
    item.question_name = newTitle;
}

function getPosition(item) {
    return item.position;
}

function setPosition(item, newPosition) {
    item.position = newPosition;
}

function getID(item) {
    return item.id;
}

module.exports = {
    actions: actions,
    getItems: getItems,
    putItem: putItem,
};