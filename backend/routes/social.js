


const express = require("express");
const router = express.Router();
const passport = require('passport');

router.get('/login', (req, res) => {
  res.send('<a href="/auth/twitter">Login with Twitter</a>');
});
router.get('/login', (req, res) => {
  res.send('<a href="/auth/tiktok">Login with tiktok</a>');
});



router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', 
  function(req, res) {
    // Successful authentication, redirect home.
    // res.redirect('/profile');
    console.log(req);
  });

  router.get('/auth/tiktok', passport.authenticate('tiktok'));
router.get('/auth/tiktok/callback',
  passport.authenticate('tiktok'), // Passport middleware should be here
  function(req, res) {
    // Successful authentication, redirect home.
    // res.redirect('/profile');
    console.log(req);
  });


// After Instagram authentication success, handle it
// router.get('/instagram-success', (req, res) => {
//   // The user is now authenticated with Instagram
//   // You can redirect the user or render a success page here
// });

// // Handle Instagram authentication failure
// router.get('/instagram-failure', (req, res) => {
//   // Authentication failed, handle it appropriately
// });


router.get('/profile', (req, res) => {
  // Access the authenticated user's information using req.user
  res.send('Welcome to your profile, ' + req.user.displayName);
});

module.exports = router;
