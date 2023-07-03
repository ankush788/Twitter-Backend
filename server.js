require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const cors = require('cors');
const passportauth = require('./route/authPassport');
const router = require("./route/passport"); /// don't change their position 
const router2 = require('./route/authRoute');
const router3 = require('./route/TweetRoute');
const router4 = require("./route/FollowRoute")
const { crossOriginResourcePolicy } = require('helmet');
const MongoDBSession = require("connect-mongodb-session")(session);
const port = process.env.PORT || 4000;

try {
    mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.f9qdln2.mongodb.net/TwitterLoginDB?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('Connected to MongoDB');
} catch (err) {
    console.log(err);
}

const store = new MongoDBSession({
    uri: `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.f9qdln2.mongodb.net/TwitterLoginDB?retryWrites=true&w=majority`,
    collection: "sessions"
});

//-----------------------------------------import----------------------------//

app.use(
    cors(
        {
            origin: 'https://twitter-front-mauve.vercel.app',  // Replace with the actual origin of your frontend server
            credentials: true, // Enable sending cookies across domains
        }
    )
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
      cookie: {
    // httpOnly: true,
      secure: true,
      sameSite: "none",
    },
        
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("hello");
});

app.use('/route', router);/// don't change their position
app.use('/auth', router2);
app.use('/data', router3);
app.use('/follow', router4);

//---------------------------------authentications----------------------------------------------//

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(port, () => {
    console.log('Server started on port 4000');
});
