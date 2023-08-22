const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
  description: String,
  image: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  status : {type: String,enum: ['active', "deleted"],default: 'active'},
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
