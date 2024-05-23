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


// home page
app.get('/', (req, res) => {

  res.render('home.ejs', { passwordUpdated: req.query.passwordUpdated })
})
app.get('/home', (req, res) => {
  res.render('welcomepage.ejs')
});

const login = require('./routes/login');
app.use(login);

const placeSearch = require('./routes/placeSearch');
app.use(placeSearch);




isUserAuthenticated = (req, res, next) => {
  if (req.session.authenticated)
    next()
  else
    res.status(401).render('notLoggedIn.ejs', { message: 'Please login first' })
};

app.use(isUserAuthenticated);

const indexscript = require('./routes/indexscript');
app.use(indexscript);
// put welcome page here later

app.get('/index', (req, res) => {
  res.render('index')
}
);



// check if a user is logged in
// user must be logged in to access the following routes
isUserAuthenticated = (req, res, next) => {
  if (req.session.authenticated) {
    req.currentUser = req.session.currentUser;
    next()
  }
  else
    res.status(401).render('notLoggedIn.ejs', { message: 'Please login first' })
};



//leaderboard pages

const leaderboard = require('./routes/leaderboard');
app.get('/localleaderboard', leaderboard);
app.get('/regionalleaderboard', leaderboard);
app.get('/globalleaderboard', leaderboard);

app.get('/match', (req, res) => {
  res.render('match.ejs')
});

app.get('/matchend', (req, res) => {
  res.render('matchover.ejs')
});

const information = require('./routes/information');
app.use(information);

const addFriends = require('./routes/addFriends')
app.use(addFriends)

// user profile
const profile = require('./routes/profile');
app.use(profile);

//other user's profile
const otherProfile = require('./routes/otherProfile');
app.use(otherProfile);

const map = require('./routes/map');
app.use(map);

const settings = require('./routes/settings');
app.use(settings);

app.get('/logout', isUserAuthenticated, function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

// page where user can edit profile directly, except email and password
app.get('/editProfile', isUserAuthenticated, (req, res) => {
  res.render('editProfile.ejs', { name: req.session.name, email: req.session.email, type: req.session.type, bio: req.session.bio, profilePicture: req.session.profilePicture })
});

const resetPassword = require('./routes/resetPassword');
const resetPasswordWithEmail = require('./routes/resetPasswordWithEmail');

app.use(resetPassword);
app.use(resetPasswordWithEmail);

const updateProfile = require('./routes/updateProfile');
app.use(updateProfile);

const createMatch = require('./routes/createMatch');
app.use(createMatch);


// app.get('/searchFriends', isUserAuthenticated, async (req, res) => {
//   const query = req.query.query;
//   let friends = [];
//   if (query) {
//     try {
//       friends = await usersModel.find({ name: new RegExp(query, 'i') }).exec();
//     } catch (error) {
//       console.error('Error searching for friends:', error);
//     }
//   }
//   res.render('searchFriends.ejs', { friends });
// });

const searchFriends = require('./routes/searchFriends')
app.use(searchFriends)

const matchSessions = require('./routes/matchSessions');
app.use(matchSessions);

const lobby = require('./routes/lobby');
app.use(lobby);

app.listen(3000, () => {
  console.log(`Server running on port 3000!!!`)
})  