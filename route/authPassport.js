const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/user');
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "https://twitter-backend-flame.vercel.app/auth/google/home"
        },
        function (accessToken, refreshToken, profile, cb) {

            // console.log(profile);
            const tokenData = {
                userId: null,
                id: profile.id, // Initialize _id as null
                name: profile.displayName,
                email: profile.emails[0].value,
                photoLink: profile.photos[0].value
            };

            User.findOrCreate({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value, photoLink: profile.photos[0].value }, function (err, user) {
                // Assign the _id value to tokenData
                tokenData.userId = user._id;

                const token = jwt.sign(tokenData, process.env.SECRET, {
                    expiresIn: "2h",
                });

                return cb(err, { user, token });
            });
        }
    )
);


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
