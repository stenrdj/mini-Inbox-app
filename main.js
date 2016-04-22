var http = require('http');
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '842598299200533';
var FACEBOOK_APP_SECRET = '6e09ed9f62d6d4c039e8c129d95b539c';
var express = require('express');
 var session = require('express-session');
var bodyParser = require('body-parser')


var app = express();
  app.use(session({ secret: 'my_precious' }));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
 app.use(passport.session());


app.set('views', __dirname + '/public/views');
app.set('view engine', 'jade');
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
profileFields: ['id', 'name','picture.type(large)', 'email', 'displayName', 'friends', 'gender']}, function(accessToken, refreshToken, profile, done) {

  process.nextTick(function() {

    done(null, profile);
  });
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/auth/facebook', passport.authenticate('facebook',{ session: true ,scope: ['user_friends','user_website']}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/#inbox',
  failureRedirect: '/error'
}));
app.get('/inbox', function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
  res.send(JSON.stringify(req.session.passport.user)+"<br></br>"+JSON.stringify(req.session));
  });

app.get('/friends', function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
  res.send(JSON.stringify(req.session.passport.user._json.friends.data));
  });


app.get('/success', function(req, res, next) {


  res.send('Successfully logged in.');
});

app.get('/error', function(req, res, next) {
  res.send("Error logging in.");
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});




 
app.listen(3000);
