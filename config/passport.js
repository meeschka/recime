const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
    },
    function(accessToken, refreshToken, profile, cb){
        User.findOne({'googleId': profile.id})
            .then(user => {
                if (user) {
                    return user;
                }
                return User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id
                });
            })
            .then(user => cb(null, user))
            .catch(err => cb(err));
    }
))

passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});