const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  message: String,
  image: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status : {type: String,enum: ['active', "deleted"],default: 'active'},
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
