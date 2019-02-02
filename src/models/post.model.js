const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PostSchema = new Schema({
    title: {type: String, required: true, max: 100},
    urlTitle: {type: String, required: true, max:100},
    body: {type: String, required: true},
    author: {type: String, required: true},
    dateCreated: {type: Date, required: true, default: Date.now},
    tags: {type: Array}
}, { collection: 'posts'});

module.exports = mongoose.model('Post', PostSchema);