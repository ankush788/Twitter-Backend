//ES6 VERSION
require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authentication = require('../middleware/authenication');
const bcrypt = require('bcrypt');
const app = express();

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

//-------------------------------passport---------------------------------------//
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ id: jwt_payload.sub })
        .then(user => {
            if (user) {
                if (jwt_payload.iss !== opts.issuer || jwt_payload.aud !== opts.audience) {
                    return done(null, false);
                }
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => {
            return done(err, false);
        });
}));

//-------------------------------register-------------------------//-
router.post('/register', async (req, res) => {
    console.log(req.body);
    try {
        const { name, password, email } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(201).json({ message: 'User already exists' });
        }

        let hashpassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashpassword });
        await newUser.save();
        return res.status(201).json({ user: { user_id: newUser.id, ...newUser }, message: 'User created!' });
    }
    catch (error) {
        console.error(error);
        return res.json({ message: 'Server error' });
    }
});


//---------------------------------------login---------------------------------------//


router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {

        const user = await User.findOne({ name });


        if (!user || !(bcrypt.compareSync(password, user.password))) {
            return res.status(201).json({ message: "Invalid credentials" });
        }

        else {

            const token = jwt.sign({ userId: user._id, name: user.name, email: user.email, Follow: user.Follow, Following: user.Following, photoLink: user.photoLink, joinDate: user.joinDate }, process.env.SECRET, {
                expiresIn: "2h",
            });

            res.cookie('token', token, {
                expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // Expiration time in 2 hours
                httpOnly: true,
                secure: true, // Set this to true if using HTTPS
                sameSite: "None",
            });
            return res.status(200).json({ user: { user_id: user.id, ...user }, message: 'User login Successful' });
        }

    } catch (error) {
        console.error(error);
        res.json({ message: 'Server error' });
    }
});

//-------------------------------home---------------------------------------//


router.get('/Authentication', authentication, (req, res) => {
    // Only authenticated users can access this route

    res.json({ user: req.user, message: 'Welcome to the home route' });
});

//----------------------------logout -----------------------------------------//
router.get("/Logout", (req, res) => {

    try {
        res.clearCookie("token");
        res.json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        console.error(error);
        res.json({ message: 'Server error' });
    }
});
module.exports = router;
