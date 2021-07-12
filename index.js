const express = require('express')
const session = require('express-session')
const passport = require('passport')
const Strategy = require('passport-anilist').Strategy
const app = express();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new Strategy({
    clientID: '5954',
    clientSecret: 'baIGoNGJSoogCrPwy9s9AxrFCV7UnJvJT0zV4hvv',
    callbackURL: 'http://185.248.33.6:5000/callback'
}, (_accessToken, _refreshToken, profile, done) => {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

app.use(session({
    secret: 'keyboard123cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', passport.authenticate('anilist'), function(req, res) {});

app.get('/callback', passport.authenticate('anilist', { failureRedirect: '/', successRedirect: '/user' }));

app.get('/user', (req, res, next) => req.isAuthenticated() ? next() : res.send('Not logged in'), function(req, res) {
    res.json(req.user);
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(() => {
    console.log('Listening !')
});

