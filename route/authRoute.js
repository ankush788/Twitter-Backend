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

app.get("/google/home", (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) {
      return res.redirect("https://twitter-backend-flame.vercel.app/auth/login/failed");
    }
    if (!user) {
      return res.redirect("https://twitter-backend-flame.vercel.app/auth/login/failed");
    }
    req.login(user, (err) => {
      if (err) {
        return res.redirect("https://twitter-backend-flame.vercel.app/auth/login/failed");
      }
      req.session.cookie.sameSite = 'none';
      req.session.cookie.secure = true;
      return res.redirect(CLIENT_URL);
    });
  })(req, res, next);
});



module.exports = router;
