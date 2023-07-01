const mongoose = require('mongoose');
const Tweetschema = new mongoose.Schema({

    name: String,
    email: String,
    tweet: String,
    photoLink: { type: String },
    likes: {
        type: [String],
        default: []
    },

});

const Tweet = mongoose.model('Tweet', Tweetschema);
module.exports = Tweet; 
