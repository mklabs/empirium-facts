const debug = require('debug')('empifacts:app');
const express = require('express');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const hbs = require('hbs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const { findOrCreateUser, getUser } = require('./services/service');
const {
  addFacts,
  renderAddFacts,
  deleteFacts,
  index,
  login,
  logout,
  renderApi,
  facts
} = require('./routes/routes');

const config =
  process.env.NODE_ENV === 'production'
    ? process.env
    : require('./now.dev.json').env;

const upload = multer();

// Server configuration

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.use(
  sass({
    src: path.join(__dirname, 'public/sass'),
    dest: path.join(__dirname, 'public/css'),
    debug: true,
    outputStyle: 'extended',
    // Where prefix is at <link rel="stylesheets" href="/css/style.css"/>
    prefix: '/css'
  })
);

app.use(express.static('public'));

// Passport configuration
app.use(
  session({
    secret: 'vive la league',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL
    },

    async (token, tokenSecret, profile, done) => {
      try {
        const user = await findOrCreateUser(profile);
        done(null, user);
      } catch (err) {
        debug('Got error in Google Strategy', err);
        console.error(err);
        done(err);
      }
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: config.TWITTER_CLIENT_ID,
      consumerSecret: config.TWITTER_CLIENT_SECRET,
      callbackURL: config.TWITTER_CALLBACK_URL
    },

    async (token, tokenSecret, profile, done) => {
      try {
        const user = await findOrCreateUser(profile);
        done(null, user);
      } catch (err) {
        debug('Got error in Twitter Strategy', err);
        console.error(err);
        done(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET,
      callbackURL: config.FACEBOOK_CALLBACK_URL
    },

    async (token, tokenSecret, profile, done) => {
      try {
        const user = await findOrCreateUser(profile);
        done(null, user);
      } catch (err) {
        debug('Got error in Facebook Strategy', err);
        console.error(err);
        done(err);
      }
    }
  )
);

// Routes

app.get('/', index);
app.get('/add-facts', renderAddFacts);
app.post('/add-facts', upload.array(), addFacts);
app.get('/facts/delete/:id', deleteFacts);
app.get('/api', renderApi);
app.get('/login', login);
app.get('/logout', logout);
app.get('/facts', facts);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: 'https://www.googleapis.com/auth/plus.login'
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
);

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

// serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = getUser(id);
    done(null, user);
  } catch (err) {
    debug('Got error in deserializeUser', err);
    console.error(err);
    done(err);
  }
});

// Server listen

const port = process.env.port || 3000;
app.listen(process.env.port || 3000, err => {
  if (err) return console.error(err);
  debug(`Listening on http://localhost:${port}`);
});
