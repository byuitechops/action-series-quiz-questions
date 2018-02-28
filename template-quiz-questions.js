/* Dependencies */
const canvas = require('canvas-wrapper');

/* Actions */
var actions = [
    require('../actions/files-delete.js'),
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
        this.type = 'File';
    }
}

/* Retrieve all items of the type */
function getItems(course, callback) {
    /* Get all of the files from Canvas */
    canvas.getFiles(course.info.canvasOU, (err, items) => {
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
function buildPutObj(file) {
    return {
        'name': file.display_name,
        'parent_folder_id': file.parent_folder_id,
        'on_duplicate': 'rename',
        /* rename/overwrite - rename adds a qualifier to make the new filename unique, overwrite replaces the existing 
                                            file with the same name. Without either, uploading a duplicate file will simply fail and we may not know why */
        'lock_at': file.lock_at,
        'unlock_at': file.unlock_at,
        'locked': file.locked,
        'hidden': file.hidden,
    };
}

function deleteItem(course, file, callback) {
    canvas.delete(`/api/v1/files/${file.id}`, (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, null);
    });
}

/* PUT an item back into Canvas with updates */
function putItem(course, file, callback) {
    if (file.delete == true) {
        deleteItem(course, file, callback);
        return;
    }
    var putObj = buildPutObj(file);
    canvas.put(`/api/v1/files/${file.id}`, putObj, (err, newItem) => {
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
    return item.display_name;
}

function setTitle(item, newTitle) {
    item.display_name = newTitle;
}

function getPosition(item) {
    return null;
}

function setPosition(item, newPosition) {
    return null;
}

function getID(item) {
    return item.id;
}

module.exports = {
    actions: actions,
    getItems: getItems,
    putItem: putItem,
};