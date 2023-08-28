const mongoose = require("mongoose");
const validator = require("./validator");
const ObjectId = mongoose.Types.ObjectId;

const routeModels = {
  "/add-post": {
    description: { type: String }
  },
  "/get-post": {
    userId: { type: ObjectId },
  },
  "/like-dislike-post": {
    _id: { required: true, type: String },
    action: { required: true, type: String, enum : ["like", "dislike"] },
  },
  "/add-comment": {
    _id: { required: true, type: ObjectId },
    comment: { required: true, type: String },
  },
  "/get-comments": {
    _id: { required: true, type: ObjectId },
  }
};

module.exports = function handler(req, res, next) {
  validator(req, res, next, routeModels[req.path]);
};
