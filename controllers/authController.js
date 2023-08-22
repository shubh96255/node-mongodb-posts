const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const authService = require("../services/authService");
const ObjectID = mongoose.Types.ObjectId;

const taskController = {
  sendOtp : async(req,res) => {
    try{
      const {verifyType,verify} = req.body;
      const checkUserExistQuery = {status : "active", verifyType,verify};
      const checkExist = await authService.checkExist(checkUserExistQuery);
      if(checkExist){
        return res.status(400).send({message: "This is already exist"});
      }
      //const generateOtp = Math.floor(1000 + Math.random() * 9000);
      const generateOtp = "5555";
      /*if(verifyType === "email"){
      //TODO:  send email create a common function 
      const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
              user: 'mellie27@ethereal.email',
              pass: 'zRHVHwVCjcbvwEYbVg'
          }
        });

        const mailOptions = {
            from: 'todoom@todoom.com',
            to: verify,
            subject: 'OTP to verify your account',
            text: `OTP to verify your account is:${generateOtp}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
      }*/

      const checkOtpExistQuery = {verifyType,verify};
      const checkOtpExist = await authService.checkExist(checkOtpExistQuery);
      let userId;
      if(checkOtpExist){
        // if email/phone already exists then update otp
        const updateQuery = {verifyType,verify};
        const dataToUpdated = {verifyOtp: generateOtp};
        await authService.updateUser(updateQuery,dataToUpdated);
        userId = checkOtpExist._id;
      }else{
        const dataToAdded = {verifyType,verify,verifyOtp: generateOtp};
        const setOtp =  await authService.addUser(dataToAdded);
        userId = setOtp._id;
      }
      return res.status(200).send({message : "OTP sent successfully", otp : generateOtp, user : {_id : userId}});
    }catch (error) {
        // Code to handle the error
        console.error('An error occurred sendOtp:', error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const checkOtpExistQuery = {_id : new ObjectID(req.body._id), verifyOtp : req.body.otp};
      const checkOtpExist = await authService.checkExist(checkOtpExistQuery);
      if(!checkOtpExist){
        return  res.status(400).json({msg  : "OTP not match"});
      }else{
        return  res.status(200).json({msg  : "OTP matched"});
      }
    } catch (error) {
      console.error('An error occurred verifyOtp:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
  createAccount: async (req, res) => {
    try {
      const {_id,username,password} = req.body;
      const usernameQuery = {username};
      const checkUserName = await authService.checkExist(usernameQuery);
      if(checkUserName){
        return   res.status(400).json({msg  : "Username already exists"});
      }
      const updateQuery = {_id : new ObjectID(_id)};
      const hashedPassword = await bcrypt.hash(password, 10);
      const dataToUpdated = {username: username, password : hashedPassword, isVerified : true, status : "active", verifyOtp :null};
      const updateUser = await authService.updateUser(updateQuery,dataToUpdated);
      if(updateUser.acknowledged){
        return res.status(200).json({msg  : "Account created successfully"});
      }
      return res.status(200).json({msg  : "Failed to create account"});
    } catch (error) {
      console.error('An error occurred createAccount:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
  
  login: async (req, res) => {
    try {
        const { email_username, password } = req.body;
        const userQuery = {
            $or: [{ username: email_username }, { verify: email_username }],
            status: "active"
        }
        const user = await authService.checkExist(userQuery);
        if (!user) {
          return res.status(400).send('Credentials not matched');
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const secretKey = process.env.JWT_SECRET;
        //create JWT token
        const token = jwt.sign(
            {
                userId: new ObjectID(user._id),
                username: user.username,
            },
            secretKey,
            { expiresIn: '24h' }
        );
        return  res.status(200).send({message :'Login successful',token});
      } else {
        return  res.status(401).send({message :'Credentials not matched'});
      }
    } catch (error) {
      console.error('An error occurred login:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },

  forgotPassword : async (req, res) => {
    try {
      const {email_phone} = req.body;
      const checkExistQuery = {verify :email_phone,status : "active" };
      const checkActive = await authService.checkExist(checkExistQuery);
      if(!checkActive){
        return   res.status(400).json({msg  : "You are not register with us"});
      }
      const generateOtp = "6666";
      const updateQuery = {verify:email_phone};
      const dataToUpdated = {verifyOtp: generateOtp};
      const updateOtp =  await authService.updateUser(updateQuery,dataToUpdated);
      if(updateOtp.acknowledged){
        return res.status(200).json({msg  : "OTP send to the registed email/phone"});
      }
      return res.status(200).json({msg  : "Failed to send OTP"});
    } catch (error) {
      console.error('An error occurred forgotPassword:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },

  verifyForgotPassword: async (req, res) => {
    try {
      const checkOtpExistQuery = {verify : req.body.email_phone, verifyOtp : req.body.otp};
      const checkOtpExist = await authService.checkExist(checkOtpExistQuery);
      if(!checkOtpExist){
        return  res.status(400).json({msg  : "OTP not match"});
      }else{
        return  res.status(200).json({msg  : "OTP matched", user : {_id : checkOtpExist._id}});
      }
    } catch (error) {
      console.error('An error occurred verifyOtp:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },

  resetPassword : async(req,res) => {
    const { _id, otp, newPassword } = req.body;
    const checkOtpExistQuery = {_id, verifyOtp : req.body.otp};
    const checkOtpExist = await authService.checkExist(checkOtpExistQuery);
    if(!checkOtpExist){
      return  res.status(400).json({msg  : "OTP not match"});
    }else{
      const updateQuery = {_id};
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const dataToUpdated = {password : hashedPassword,verifyOtp :null};
      const updateUser = await authService.updateUser(updateQuery,dataToUpdated);
      return  res.status(200).json({msg  : "Password reset successfully"});
    }

  }

 
  // Add more controller methods as needed
};

module.exports = taskController;