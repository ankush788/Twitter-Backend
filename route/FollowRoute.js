const express = require("express");
const router = express.Router();
const Tweet = require('../models/tweet');
const { ObjectId } = require('mongoose').Types;
const Comment = require('../models/TwitterComment')
const User = require('../models/user')

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
       
                res.json({ sucess: false, total: Follower.Follow.length, message: "start following " });
            
        }
        else {
            Follower.Follow.splice(followIndex, 1);
            Following.Following.splice(followingIndex, 1);
            await Following.save();
            await Follower.save();
         
                res.json({ sucess: true, total: Follower.Follow.length, message: "unfollow" });
          
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
