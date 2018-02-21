module.exports = (course, file, callback) => {

    /* If the item is marked for deletion, do nothing */
    if (file.techops.delete == true) {
        callback(null, course, file);
        return;
    }

    /* Pages to be deleted, in LOWER case */
    var doomedItems = [
        // /guidelines\s*for\s*button/gi,
        // /discussion\sforums/gi,
    ];

    /* The test returns TRUE or FALSE - action() is called if true */
    var found = doomedItems.find(item => item.test(file.display_name));

    /* This is the action that happens if the test is passed */
    function action() {
        file.techops.delete = true;
        course.log('Files Deleted', {
            'Title': file.display_name,
            'ID': file.id
        });
        callback(null, course, file);
    }

    if (found != undefined) {
        action();
    } else {
        callback(null, course, file);
    }

};