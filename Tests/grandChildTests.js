/* Dependencies */
const tap = require('tap');
const canvas = require('canvas-wrapper');
const asyncLib = require('async');

module.exports = (course, callback) => {
    tap.test('action-series-quiz-questions', (tapTest) => {
        function quiz_questions_delete(seriesCallback) {
            setTimeout(() => {

                seriesCallback(null);
            }, 100);
        }

        /* An array of functions for each associated action in action-series-quiz-questions */
        var myFunctions = [
           quiz_questions_delete,
        ];

        /* Run each universal grandchilds' test in its own function, one at a time */
        asyncLib.series(myFunctions, (seriesErr) => {
            if (seriesErr) {
                course.error(seriesErr);
            }
            tapTest.pass('potato');
            tapTest.end();
        });
    });

    callback(null, course);
};