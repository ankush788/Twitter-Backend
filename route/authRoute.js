const router = require("express").Router();
const passport = require("passport");

const CLIENT_URL = "http://localhost:3000/";

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
  console.log("/login/failed");
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
)
// router.get(
//   "/google/home",
//   passport.authenticate("google", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed",
//     session: true, // Enable session-based authentication

//     // Add a custom callback function after successful authentication
//     successCallback: function (req, res) {
//       // Get the session ID
//       const sessionId = req.sessionID;

//       // Set the "connect.sid" cookie with secure and sameSite attributes
//       res.cookie("connect.sid", sessionId, {
//         secure: true,
//         sameSite: "none",
//       });

//       // Redirect to the success page or send a JSON response
//       res.redirect(CLIENT_URL); // Modify this as per your requirements
//     },
//   })
// );




module.exports = router;
