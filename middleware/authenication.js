const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.token; // Retrieve token from the cookie
    if (!token) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return res.status(401).json({ message: 'Missing token' });
        }
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};


module.exports = authenticate;