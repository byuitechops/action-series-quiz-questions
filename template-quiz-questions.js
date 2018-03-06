/* Dependencies */
const canvas = require('canvas-wrapper');

/* Actions */
var actions = [
    require('./actions/quiz-questions-delete.js'),
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
        this.quiz_id = this.quiz_id;
    }
}

/********************************************************
 *  BETA: This API resource is not finalized, and there 
 * could be breaking changes before its final release. 
 ********************************************************/

/* Retrieve all items of the type */
function getItems(course, callback) {
    /* Get all of the quiz questions from Canvas */
    canvas.getQuizQuestions(course.info.canvasOU, (err, items) => {
        if (err) {
            callback(err);
            return;
        }
        /* Give each item the TechOps helper class */
        items.forEach(it => {
            it.techops = new TechOps();
        });

        callback(null, items);
    });
}

/* Build the PUT object for an item */
function buildPutObj(question) {
    return {
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
    canvas.put(`/api/v1/courses/${course.info.canvasOU}/quizzes/${question.techops.quiz_id}/questions/${question.id}`, putObj, (err, newItem) => {
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