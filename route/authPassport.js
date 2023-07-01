const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/user');
const passport = require("passport");


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/google/home",
        },
        function (accessToken, refreshToken, profile, cb) {
          
            User.findOrCreate({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value, photoLink: profile.photos[0].value }, function (err, user) {
                return cb(err, user);
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
