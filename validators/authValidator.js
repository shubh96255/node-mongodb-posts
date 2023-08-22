const validator = require("./validator");

const routeModels = {
  "/send-otp": {
    verifyType: { required: true, type: String },
    verify : { required: true, type: String },
  },
  "/verify-create-otp": {
    _id: { required: true, type: String },
    otp: { required: true, type: Number },
  },
  "/create-account": {
    _id: { required: true, type: String },
    username: { required: true, type: String },
    password: { required: true, type: String },
  },
  "/login": {
    email_username: { required: true, type: String },
    password: { required: true, type: String },
  },
  "/forgot-password": {
    email_phone: { required: true, type: String },
  },
  "/verify-forgot-otp": {
    email_phone: { required: true, type: String },
    otp: { required: true, type: Number },
  },
  "/reset-password": {
    _id: { required: true, type: String },
    newPassword: { required: true, type: String },
    otp: { required: true, type: Number },
  },
};

module.exports = function handler(req, res, next) {
  validator(req, res, next, routeModels[req.path]);
};
