const router = require("express").Router();
const passport = require("passport");

const CLIENT_URL = "https://twitter-front-mauve.vercel.app";

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            //   cookies: req.cookies
        });
    }
});

router.get("/login/failed", (req, res) => {
    res.json({
        success: false,
        message: "failure",
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});


router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  "/google/home",
  passport.authenticate("google", {
    
    failureRedirect: "/login/failed",
      
    session: true, // Enable session-based authentication

    // Add a custom callback function after successful authentication
    successCallback: function (req, res) {
      // Get the session ID
      const sessionId = req.sessionID;

      // Set the "connect.sid" cookie with secure and sameSite attributes
      res.cookie("connect.sid", sessionId, {
          httpOnly: true,
      secure: true,
      sameSite: "none",
      });

      // Redirect to the success page or send a JSON response
      res.redirect(CLIENT_URL); // Modify this as per your requirements
    },
  })
);




module.exports = router;
