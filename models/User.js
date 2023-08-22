const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {type: String},
  password:{type: String},
  verifyType: {type: String,enum: ['mobile', 'email'],default: 'email'},
  verify :{type: String},
  verifyOtp : {type: String},
  isVerified : {type : Boolean,default : false},
  status : {type: String,enum: ['active', 'inactive', "deleted"],default: 'inactive'},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
