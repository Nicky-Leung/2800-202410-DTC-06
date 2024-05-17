//Please put routes in routes file instead of server.js so that the code is more organized and easier to read.
const express = require('express')
const app = express()
const path = require('path')
app.set('view engine', 'ejs')
var session = require('express-session');
require('dotenv').config();
var mongoDBStore = require('connect-mongodb-session')(session);

var store = new mongoDBStore({
  uri: `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.9kdinuu.mongodb.net/connect_mongodb_session_test?retryWrites=true&w=majority`,
  collection: 'mySessions'
});

const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.9kdinuu.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`);
    console.log('Connected to MongoDB');
  }
  catch (err) {
    console.log(err);
  }
}

main().catch(err => console.log(err));

const usersModel = require('./models/userModel');
const matchModel = require('./models/matchModel');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 },
  store: store,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/index.js', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'your-js-file.js'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const replacedData = data.replace('process.env.MapKey', JSON.stringify(process.env.MapKey));
    res.type('.js');
    res.send(replacedData);
  });
});

// home page
app.get('/', (req, res) => {

  res.render('home.ejs', { passwordUpdated: req.query.passwordUpdated })
})
app.get('/home', (req, res) => {
  res.render('welcomepage.ejs')
});

// log in page
// reset user while logged in

// this is where user creates an account


// put welcome page here later

app.get('/index', (req, res) => {
  res.render('index')
}
);

app.get('/information', (req, res) => {

  res.render('components/information')
});


// check if a user is logged in
// user must be logged in to access the following routes
isUserAuthenticated = (req, res, next) => {
  if (req.session.authenticated)
    next()
  else
    res.status(401).render('notLoggedIn.ejs', { message: 'Please login first' })
};

// app.use(isUserAuthenticated) // no longer applying this globally

// landing page after login
app.get('/protectedRoute', isUserAuthenticated, (req, res) => {
  if (req.session.authenticated) {
    res.render('protectedRoute.ejs', { name: req.session.name })
  } else {
    res.render('notLoggedIn.ejs', { message: 'You must be logged in to access this route!!!' })
  }
});
// log the user out, destroy the session, and redirect to the home page


//leaderboard pages
app.get('/localleaderboard', (req, res) => {
  res.render('leaderboard_local.ejs')
});
app.get('/globalleaderboard', (req, res) => {
  res.render('leaderboard_global.ejs')
});
app.get('/regionalleaderboard', (req, res) => {
  res.render('leaderboard_regional.ejs')
});

app.get('/match', (req, res) => {
  res.render('match.ejs')
});

// user profile
app.get('/profile', isUserAuthenticated, (req, res) => {
  res.render('profile.ejs', { name: req.session.name, email: req.session.email, type: req.session.type })
});

const login = require('./routes/login');
app.use(login);

const map = require('./routes/map');
app.use(map);


app.get('/logout', isUserAuthenticated, function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

const createMatch = require('./routes/createMatch');
app.use(createMatch);


app.listen(3000, () => {
  console.log(`Server running on port 3000!!!`)
})  