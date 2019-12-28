const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Recime', user: req.user });
});
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/recipes',
    failureRedirect: '/'
  }
));
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/recipes');
});

module.exports = router;
