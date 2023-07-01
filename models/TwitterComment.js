const mongoose = require('mongoose');
const Commentschema = new mongoose.Schema({

    name: String,
    email: String,
    tweet: String,
    photoLink: { type: String },
    parentId: {
        type: String,

    },
    likes: {
        type: [String],
        default: []
    },

});

const Comment = mongoose.model('Comment', Commentschema);
module.exports = Comment; 
