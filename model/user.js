const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    cmt: {
        type: String
    },
    provider: {
        type: String
    },
    providerImg: {
        type: String
    }
});

const postSchema = new mongoose.Schema({
    text: {
        type: String
    },
    comments: [commentSchema],
    date: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    posts: [postSchema],
    myImage: {
        type: String,
        required: true
    }
});






const User = mongoose.model('User', userSchema);

module.exports = User;