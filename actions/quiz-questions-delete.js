/******************************************************************************
 * Quiz Questions Delete
 * Description: Create an array of quiz question titles and set their delete 
 * attribute on the TechOps class to true. If the delete attribute is set to 
 * true, the quiz question will be deleted in action-series-master main.js 
 ******************************************************************************/
module.exports = (course, question, callback) => {
    try {




        /* If the item is marked for deletion, do nothing */
        if (question.techops.delete === true) {
            callback(null, course, question);
            return;
        }

        /* Pages to be deleted, in LOWER case */
        var doomedItems = [
            // /guidelines\s*for\s*button/gi,
            // /discussion\sforums/gi,
        ];

        /* The test returns TRUE or FALSE - action() is called if true */
        var found = doomedItems.find(item => item.test(question.display_name));

        /* This is the action that happens if the test is passed */
        function action() {
            question.techops.delete = true;
            question.techops.log('Files Deleted', {
                'Title': question.display_name,
                'ID': question.id
            });
            callback(null, course, question);
        }

        if (found != undefined) {
            action();
        } else {
            callback(null, course, question);
        }
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, question);
    }
};

module.exports.details = {
    title: 'quiz-questions-delete'
}