const reelService = require("../services/reelService");

const reelController = {
  postReel: async (req, res) => {
    try {
      const userId = req.user.userId;
      const postData = {
        description : req.body.description,
        video : req.file.filename,
        uploadedBy : userId
      }
      await reelService.postReel(postData);
      return res.status(200).json({ message: 'Post added successfully' });
    } catch (error) {
      console.error('An error occurred addPost:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },

  getReels: async (req, res) => {
    try {
      const projection = {description:1, video:1,uploadedBy:1}
      const allPosts =  await reelService.getReels(req,projection);
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

  addComment: async (req, res) => {
    try {
      const dataToInsert = {
        postId : req.body._id,
        comment : req.body.comment,
        userId : req.user.userId
      };
      await postService.addComment(dataToInsert);
      return res.status(200).json({message : "Comment added"});
    } catch (error) {
      console.error('An error occurred addPost:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },

  getComments: async (req,res) => {
    try {
      const {_id} = req.query;
      const commentsQuery = {postId : _id, status : "active"};
      const allComments =  await postService.getComments(commentsQuery);
      return res.status(200).json({ message: 'Comments list' , comments:allComments});
    } catch (error) {
      console.error('An error occurred getComments:', error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
 
};

module.exports = reelController;