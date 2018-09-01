const debug = require('debug')('empifacts:app');
const express = require('express');
require('express-async-errors');

const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const path = require('path');
const multer = require('multer');
const upload = multer();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const hbs = require('hbs');
const passport = require('passport');
const Sequelize = require('sequelize');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const { initDB } = require('./models');
const { findOrCreateUser, getUser } = require('./services/service');
const {
  addFacts,
  renderAddFacts,
  deleteFacts,
  index,
  login,
  logout,
  renderApi,
  facts,
  cgu
} = require('./routes/routes');

// Server configuration

const config = process.env.NOW ? process.env : require('./now.dev.json').env;

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
app.get('/cgu', cgu);

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

// Error managment
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500);
  res.render('error', {
    err: process.env.NOW ? err.message : err.stack
  });
});

// serialize user into the session
passport.serializeUser((user, done) => {
  debug('Serialize user', user.dataValues);
  done(null, user.get('id'));
});

passport.deserializeUser(async (id, done) => {
  debug('Deserialize user', id);
  try {
    const user = await getUser(id);
    done(null, user);
  } catch (err) {
    debug('Got error in deserializeUser', err);
    console.error(err);
    done(err);
  }
});

// Init db and app
const init = async () => {
  debug('Init application. Environment: ', config.NODE_ENV);
  debug('Is on now:', config.NOW);

  const { connection } = await initDB(config);

  // todo: remove force when in production; swap database between PROD and DEV
  await connection.sync();

  const port = process.env.port || 3000;
  app.listen(port, err => {
    if (err) return console.error(err);
    debug(`Listening on http://localhost:${port}`);
  });
};

(async () => {
  try {
    await init();
  } catch (err) {
    console.error('Error initializing application:');
    console.error(err);
    process.exit(1);
  }
})()
