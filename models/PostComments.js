const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new mongoose.Schema({
    postId: { type: String, required: true, ref: 'Post' },
    userId : {type: String, required: true , ref: 'User'},
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status : {type: String, enum: ['active', "deleted"],default: 'active'},
});

const PostComment = mongoose.model('post_comments', commentsSchema);

module.exports = PostComment;
