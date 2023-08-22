const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    console.log({file})
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const postController = {
  addPost: async (req, res) => {
    try {
   // const { description } = req.body;
   // const imageUrl = req.image;

    console.log({description : req.body});
    return res.send("here")
     
    } catch (error) {
      console.error('An error occurred addPost:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
  
 
  // Add more controller methods as needed
};

module.exports = postController;