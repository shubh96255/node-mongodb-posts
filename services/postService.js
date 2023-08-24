const mongoose = require("mongoose");
const Post = require("../models/Post");
const PostComment = require("../models/PostComments");
const perPage = require("../constants").POST_LIMIT;

/* function is used to add a new user */
async function createPost(data){
    return Post.create(data);
}

async function getPost(req,projection){
    const page = parseInt(req.query.page) || 1; 
    const loggedInUserId = req.user.userId;
    return Post.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'uploadedBy',
                foreignField: '_id',
                as: 'uploadedBy'
            }
        },
        {
            $addFields: {
                uploadedBy: { $arrayElemAt: ['$uploadedBy.username', 0] },
                isLikedByUser: { $in: [loggedInUserId, "$likedBy"] },
                totalLikes : {$size : "$likedBy"}
            }
        },
        {
            $project: {
                _id: 1,
                description: 1,
                image: 1,
                uploadedBy: 1,
                totalLikes: 1,
                isLikedByUser: 1
            }
        }
    ])
}


async function likeDislike(_id,likeQuery){
  return Post.findByIdAndUpdate(_id,likeQuery,{ new: true })
}

async function addComment(data){
    return PostComment.create(data)
}

async function getComments(query){
    return PostComment.find(query)
        .select('postId comment userId')
        .populate({
           path: 'userId',
           select: '_id username',
        }).lean();
}

module.exports = {
    createPost,
    getPost,
    likeDislike,
    addComment,
    getComments
}