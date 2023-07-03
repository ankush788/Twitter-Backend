const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const jwtToken = req.cookies.token; // Retrieve JWT token from the cookie
    const googleToken = req.cookies['connect.sid']; // Retrieve Google authentication token from the cookie
   console.log(googleToken);
    if (jwtToken) {
        try {
            const decoded = jwt.verify(jwtToken, process.env.SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid JWT token' });
        }
    } else if (googleToken) {
        // Authenticate using session-based authentication with passport
        passport.authenticate('google', { session: true })(req, res, next);
    } else {
        return res.status(401).json({ message: 'Missing token' });
    }
};

module.exports = authenticate;
