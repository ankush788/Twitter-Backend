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
            callbackURL: "http://localhost:8000/auth/google/home"
        },
        function (accessToken, refreshToken, profile, cb) {
          
            const token = jwt.sign({ userId: profile.id, name: profile.displayName, email: profile.emails[0].value, photoLink: profile.photos[0].value}, process.env.SECRET, {
                expiresIn: "2h",
            });

            User.findOrCreate({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value, photoLink: profile.photos[0].value }, function (err, user) {
                return cb(err, {user, token});
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
