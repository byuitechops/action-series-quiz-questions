/* Remove "rel noopener" attributes from quiz question HTML */
const cheerio = require('cheerio');

module.exports = (course, question, callback) => {

    /* This is the action that happens if the test is passed */
    function action() {
        var $ = cheerio.load(question.techops.getHTML(question));

        /* Get the target attribute for each <a></a> tag */
        var links = $('a').get();
        // links.push($('area').get());
        // links.push($('link').get());

        console.log (`links: ${links}`);

        /* If there are links in the item and if the links are external, set target attribute to '_blank' */
        // if (links.length !== 0) {
        //     links.forEach(link => {
        //         var oldTarget = $(link).attr('target');
        //         /* Link is external if it does not include 'byui.instructure' in the href attribute */
        //         if (!$(link).attr('href').includes('byui.instructure')) {
        //             /* If their is no 'target' attribute, or it is set to anything but '_blank'... */
        //             if ($(link).attr('target') !== '_blank') {
        //                 /* Set new target to _blank */
        //                 $(link).attr('target', '_blank');

        //                 /* Log it to the console and our report */
        //                 course.log(`${item.techops.type} - External Link Target Attribute Set to _blank`, {
        //                     'Title': item.techops.getTitle(item),
        //                     'ID': item.techops.getID(item),
        //                     'URL': $(link).attr('href'),
        //                     'Old Target': oldTarget,
        //                 });
        //             }
        //         }
        //     });
        // }

        /* Set the new html of the put item */
        // question.techops.setHTML(question, $.html());

        /* Next item or grandchild module */
        callback(null, course, question);
    }


    /* If the item is marked for deletion, do nothing */
    if (question.techops.delete === true || question.techops.getHTML(question) === null) {
        callback(null, course, question);
        return;
    } else {
        action();
    }
};