const express = require("express");
const router = express.Router();
const Tweet = require('../models/tweet');
const { ObjectId } = require('mongoose').Types;
const Comment = require('../models/TwitterComment')
const User = require('../models/user')
//-------------------------UserTweet Data -------------------------// 

router.post("/UserTweet", async (req, res) => {
    const { name } = req.body;
    try {
        const Tweets = await Tweet.find({ name });

        res.status(200).json({ size: Tweets.length });
    }
    catch (err) {
        console.log(err);
    }

});

//------------------user Recommendation-------------------------------------//

router.post("/Recommendation", async (req, res) => {
    const { name } = req.body;
    try {
        const recommendations = await User.find({ name: { $ne: name } })
            .limit(4).exec();

        res.json({ people: recommendations });
    }
    catch (err) {
        console.log(err);
    }

});
//------------------------creating new tweet --------------------//
router.post("/Tweet", async (req, res) => {

    try {
        const { parentId } = req.body;


        // this is for creating new comment
        if (parentId && ObjectId.isValid(parentId)) {

            const newComment = new Comment(req.body);
            await newComment.save();
            res.json({ message: "comment save" });
        }

        // this is for new Tweet   
        else {

            const newTweet = new Tweet(req.body);
            await newTweet.save();
            res.json({ message: "tweet save" });
        }

    }
    catch (err) {
        console.log(err);
        res.json({ message: "error occur on saving " });
    }
});

//---------------------------------fetching all tweet ------------------//
router.get("/AllTweet", async (req, res) => {
    try {
        const value = await Tweet.find({});
        res.json({ user: value, message: "Data Fetech Sucessfully" });
    }
    catch (err) {
        console.log(err);
        res.json({ message: "error occur on fetching" });
    }
});

//----------------------------------------fetching all comments ------------------------//

router.post("/AllComment", async (req, res) => {
    const { parentId } = req.body;
    try {
        const comments = await Comment.find({ parentId });

        res.status(200).json({ comment: comments, size: comments.length });
    }
    catch (err) {
        console.log(err);
    }
});


//----------------------------fetching tweets like ----------------------------//
router.post("/TweetLike", async (req, res) => {


    try {
        const { tweet_id: id, username, parentId } = req.body;
        let data;
        if (!parentId) {
            data = await Tweet.findById(id);
        }
        else {
            data = await Comment.findById(id);
        }

        if (data) {
            const likeIndex = data.likes.indexOf(username);
            if (likeIndex == -1) {
                data.likes.push(username);
                await data.save();
                res.json({ sucess: true, totalLikes: data.likes.length });
            }
            else {
                data.likes.splice(likeIndex, 1);
                await data.save();
                res.json({ sucess: false, totalLikes: data.likes.length });
            }
        }
        else {

            res.status(200).json({ message: "tweet not found " });
        }
    }
    catch (err) {
        console.log(err);
    }
});

//----------------fetching intial likes ---------------------//
router.post("/FetchLike", async (req, res) => {

    try {
        let data;
        const { tweet_id: id, username, parentId } = req.body;


        if (!parentId) {
            data = await Tweet.findById(id);

        }
        else {
            data = await Comment.findById(id);
        }

        if (data) {
            const likeIndex = data.likes.indexOf(username);
            if (likeIndex == -1) {

                res.json({ sucess: false, totalLikes: data.likes.length });
            }
            else {

                res.json({ sucess: true, totalLikes: data.likes.length });
            }
        }
        else {

            res.status(200).json({ message: "tweet not found " });
        }
    }
    catch (err) {
        console.log(err);
    }
});

//---------------------for Tweet delete-------------------------------//
router.post("/DeleteTweet", async (req, res) => {
    try {
        const { username, tweet_id: id, parentId } = req.body;

        let data;

        if (!parentId) {
            data = await Tweet.findById(id);
        }
        else {
            data = await Comment.findById(id);
        }
        if (data.name === username) {
            if (!parentId) {
                await Tweet.findByIdAndDelete(id);
            }
            else {
                await Comment.findByIdAndDelete(id);
            }
            res.json({ message: "tweet deleted" });
        }
        else {
            res.json({ message: "you are authorise to do this " });
        }
    }
    catch (err) {
        console.log(err);
    }
});
//-----------------------------------------------------------------//
//--------------------------fetching follower ----------------------------------//
router.post("/UserFollower", async (req, res) => {
    try {
        const { UserId, publicId } = req.body;
        const Follower = await User.findById(UserId); // get a follower
        const Following = await User.findById(publicId);  // get a following 
        const followIndex = Follower.Follow.indexOf(publicId);
        const followingIndex = Following.Following.indexOf(UserId);

        if (followIndex == -1) {
            Follower.Follow.push(publicId);
            Following.Following.push(UserId);
            await Following.save();
            await Follower.save();
            res.json({ sucess: true, total: Follower.Follow.length, message: "start following " });
        }
        else {
            Follower.Follow.splice(followIndex, 1);
            Following.Following.splice(followingIndex, 1);
            await Following.save();
            await Follower.save();
            res.json({ sucess: false, total: Follower.Follow.length, message: "unfollow" });
        }

    }
    catch (err) {
        console.log(err);
    }
});

//------------------------------------------Intial Follower---------------------//
router.post("/IntialUserFollower", async (req, res) => {
    try {
        const { UserId, publicId } = req.body;
        const Follower = await User.findById(UserId);

        const followIndex = Follower.Follow.indexOf(publicId);

        if (followIndex == -1) {

            res.json({ sucess: false, total: Follower.Follow.length, message: "start following " });
        }
        else {

            res.json({ sucess: true, total: Follower.Follow.length, message: "unfollow" });
        }

    }
    catch (err) {
        console.log(err);
    }
});

//---------------------------------------------follower Following Data ---------------------------------------------//
router.post("/FollowAndFollowing", async (req, res) => {
    const { UserId } = req.body;
    let follower = [];
    let following = [];
    try {
        const user = await User.findById(UserId);  //find the user
      
        for (const Follower of user.Follow) {
            const person = await User.findById(Follower);
            follower.push(person);
        }

        for (const Following of user.Following) {
            const person = await  User.findById(Following);
            following.push(person);
        }
        res.json({ follower: follower, following: following });

    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
