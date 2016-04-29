var http = require('http');
var https = require('https');
// calling facebook api
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var FACEBOOK_APP_ID = '246976935507601';
var FACEBOOK_APP_SECRET = 'dbe55da011e9bd40d682818819e263d6';

var express = require('express');
 var session = require('express-session');
var bodyParser = require('body-parser')


var app = express();
  app.use(session({ secret: 'my_precious' }));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
 app.use(passport.session());

var atoken={};
// asking expressjs to uses views from a specifc folder
app.set('views', __dirname + '/public/views');
app.set('view engine', 'jade');
var strategy = new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  authorizationURL: 'https://www.facebook.com/v2.3/dialog/oauth',
    tokenURL: 'https://graph.facebook.com/v2.3/oauth/access_token',
profileFields: ['id', 'name','picture.type(large)', 'email','inbox.limit(5)', 'displayName', 'friends', 'taggable_friends.limit(50000)']}, function(req, accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    // storing facebook token in order to using it later.
atoken=refreshToken;
    done(null, profile);
  });
});

passport.use(strategy);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/auth/facebook', passport.authenticate('facebook',{ session: true ,scope: ['user_friends','user_website','read_mailbox']}));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/#inbox',
  failureRedirect: '/erro'
}));
app.get('/inbox', function(req, res) {
   //inbox page , showing JSON data about inbox

    //getting latest data from facebook about inbox 
    https.get('https://graph.facebook.com/v2.3/me/inbox?limit=5&access_token='+atoken.access_token, function(ress) {

            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            ress.on('data', function(chunk) {
              // You can process streamed parts here...
              bodyChunks.push(chunk);
            }).on('end', function() {
              var body = Buffer.concat(bodyChunks);
                     if(req.session.passport!=null)
                      //injecting data returned in a session to be returned to front
              req.session.passport.user._json.inbox=body.toString('utf8');
            })

   });
    // checking if already connected
       if(req.session.passport!=null)
  res.send(req.session.passport.user._json);
else
  // if not return to home and connect
	  res.redirect('/');

  });

app.get('/inbox/:id', function(req, res) {
    // getting data about a specific conversation 
    var resultat = [];
    for (var i = req.session.passport.user._json.inbox.data.length - 1; i >= 0; i--) {
  if(req.session.passport.user._json.inbox.data[i].id == req.params.id)
    resultat.push(req.session.passport.user._json.inbox.data[i]);
};
  res.send(resultat);
  });

app.get('/friends', function(req, res) {
    // getting data about friends .

    if(req.session.passport!=null)
  res.send(req.session.passport.user._json.taggable_friends.data);
  });





 
app.listen(3000);
