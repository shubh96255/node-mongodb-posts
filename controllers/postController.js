const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const postService = require("../services/postService");

const postController = {
  addPost: async (req, res) => {
    try {
      const userId = req.user.userId;
      const postData = {
        description : req.body.description,
        image : req.file.filename,
        uploadedBy : userId
      }
      await postService.createPost(postData);
      return res.status(200).json({ message: 'Post added successfully' });
    } catch (error) {
      console.error('An error occurred addPost:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },

  getPost: async (req, res) => {
    try {
      const projection = {description:1, image:1,uploadedBy:1}
      const allPosts =  await postService.getPost(req,projection);
      return res.status(200).json({ message: 'Post list' , posts:allPosts});
    } catch (error) {
      console.error('An error occurred addPost:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },

  likeDislike: async (req, res) => {
    try {
      const {_id,action} = req.body;
      const userId = req.user.userId;

      let likeQuery = {};
      let returnMessage = {}; 
      if(action === "like"){
        likeQuery = { $addToSet: { likedBy: userId } };
        returnMessage = { message: 'Post liked'};
      }else{
        likeQuery = { $pull: { likedBy: userId } };
        returnMessage = { message: 'Post disliked'};
      }
      await postService.likeDislike(_id,likeQuery);
      return res.status(200).json({...returnMessage});
    } catch (error) {
      console.error('An error occurred addPost:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
 
};

module.exports = postController;