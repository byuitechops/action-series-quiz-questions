const cheerio = require('cheerio');

module.exports = (course, question, callback) => {
    try {
        //only add the platforms your grandchild should run in
        var validPlatforms = ['online', 'pathway', 'campus'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        /* If the item is marked for deletion or isn't a valid platform type, do nothing */
        if (question.techops.delete === true || validPlatform !== true) {
            callback(null, course, question);
            return;
        }

        /* This is the action that happens if the test is passed */
        function action() {
            /* For all answer array objects, append all instances of each property type into one string */
            var comments = question.answers.reduce((acc, answer) => {
                return acc += answer.comments_html;
            }, '');

            var correctComments = question.answers.reduce((acc, answer) => {
                return acc += answer.correct_comments_html;
            }, '');

            var incorrectComments = question.answers.reduce((acc, answer) => {
                return acc += answer.incorrect_comments_html;
            }, '');

            var neutralComments = question.answers.reduce((acc, answer) => {
                return acc += answer.neutral_comments_html;
            }, '');

            var answerComments = question.answers.reduce((acc, answer) => {
                return acc += answer.answer_comments;
            }, '');

            /* Create a cheerio object to parse for each property where a broken link might be found */
            var $ = cheerio.load(question.techops.getHTML(question) || '');
            var $$ = cheerio.load(question.correct_comments_html || '');
            var $$$ = cheerio.load(question.incorrect_comments_html || '');
            var $$$$ = cheerio.load(question.neutral_comments_html || '');
            var $$$$$ = cheerio.load(comments || '');
            var $$$$$$ = cheerio.load(correctComments || '');
            var $$$$$$$ = cheerio.load(incorrectComments || '');
            var $$$$$$$$ = cheerio.load(neutralComments || '');
            var $$$$$$$$$ = cheerio.load(answerComments || '');

            /* Get each <a> tag */
            var questionTextLinks = $('a').get();
            var correctCommentsLinks = $$('a').get();
            var incorrectCommentsLinks = $$$('a').get();
            var neutralCommentsLinks = $$$$('a').get();
            var answersCommentsLinks = $$$$$('a').get();
            var answersCorrectCommentsLinks = $$$$$$('a').get();
            var answersIncorrectCommentsLinks = $$$$$$$('a').get();
            var answersNeutralCommentsLinks = $$$$$$$$('a').get();
            var answersAnswerCommentsLinks = $$$$$$$$$('a').get();

            /* Put all of the <a> tags in one array to check against */
            var links = [
                ...questionTextLinks,
                ...correctCommentsLinks,
                ...incorrectCommentsLinks,
                ...neutralCommentsLinks,
                ...answersCommentsLinks,
                ...answersCorrectCommentsLinks,
                ...answersIncorrectCommentsLinks,
                ...answersNeutralCommentsLinks,
                ...answersAnswerCommentsLinks,
            ];

            /* If there are links in the quiz question and if the links are d2l quickLinks, then log it */
            if (links.length !== 0) {
                links.forEach(link => {
                    /* Link is likely broken if it includes 'quickLink' in the href attribute */
                    if ($(link).attr('href') && $(link).attr('href').includes('quickLink')) {
                        /* Log it to the console and our report */
                        question.techops.log(`${question.techops.type} - D2L QuickLinks`, {
                            'Title': question.techops.getTitle(question),
                            'Question ID': question.techops.getID(question),
                            'Quiz ID': question.quiz_id,
                            'Broken URL': $(link).attr('href'),
                        });
                    }
                });
            }

            /* Next item or grandchild module */
            callback(null, course, question);
        }

        action();
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, question);
    }
};

module.exports.details = {
    title: 'quiz-questions-broken-quicklinks'
}