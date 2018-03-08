const cheerio = require('cheerio');

module.exports = (course, question, callback) => {

    /* This is the action that happens if the test is passed */
    function action() {
        var $ = cheerio.load(question.techops.getHTML(question));
        var $$ = cheerio.load(question.correct_comments || '');
        var $$$ = cheerio.load(question.incorrect_comments || '');
        var $$$$ = cheerio.load(question.neutral_comments || '');

        /* Get each <a> tag */
        var questionTextLinks = $('a').get();
        var correctCommentsLinks = $$('a').get();
        var incorrectCommentsLinks = $$$('a').get();
        var neutralCommentsLinks = $$$$('a').get();

        /* Put all of the <a> tags in one array to check against */
        var links = [
            ...questionTextLinks, 
            ...correctCommentsLinks, 
            ...incorrectCommentsLinks, 
            ...neutralCommentsLinks
        ];

        /* If there are links in the quiz question and if the links are d2l quickLinks, then log it */
        if (links.length !== 0) {
            links.forEach(link => {
                console.log(`link: ${$(link).attr('href')}`);
                /* Link is likely broken if it includes 'quickLink' in the href attribute */
                if ($(link).attr('href').includes('quickLink')) {
                    console.log(`includes href
                    `);
                        /* Log it to the console and our report */
                        course.log(`${question.techops.type} - D2L QuickLinks Logged`, {
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

    /* If the item is marked for deletion, do nothing */
    if (question.techops.delete === true) {
        callback(null, course, question);
        return;
    } else {
        action();
    }
};