const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reelsSchema = new mongoose.Schema({
  description: String,
  video: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  status : {type: String,enum: ['active', "deleted"],default: 'active'},
  createdAt: { type: Date, default: Date.now }
});

const Reel = mongoose.model('Reel', reelsSchema);

module.exports = Reel;
