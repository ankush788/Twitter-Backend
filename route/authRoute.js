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


router.get('/google', (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
});

router.get(
  "/google/home",
  passport.authenticate("google", { failureRedirect: "/login/failed" }), (req, res) => {
    const token = req.user.token;

    res.cookie('token', token, {
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // Expiration time in 2 hours
      httpOnly: true,
      secure: true, // Set this to true if using HTTPS
      sameSite: "None",
    });

    res.redirect(CLIENT_URL);
  }
);

module.exports = router;
