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




// put welcome page here later

app.get('/index', (req, res) => {
  res.render('index')
}
);

app.get('/information', (req, res) => {

  res.render('components/information')
  res.render('components/information')
});


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

app.get('/matchend', (req, res) => {
  res.render('matchover.ejs')
});








app.get('/addFriends', isUserAuthenticated, async (req, res) => {
  try {
    const users = await usersModel.find({});
    const currentUser = req.currentUser;
    console.log('current user at addfriends', currentUser)
    res.render('addFriends.ejs', { users: users, currentUser: currentUser });
  } catch (err) {
    console.log('error fetching users');
  }
});


// app.post('/addFriends/befriend', async (req, res) => {
//   console.log('id:', req.session.id)

//   res.redirect('/addFriends');
// });

app.post('/addFriends/befriend', isUserAuthenticated, async (req, res) => {
  console.log('user:', req.currentUser)
  console.log('friendID:', req.body.friendId)

  try {
    const currentUser = req.currentUser;
    if (!currentUser || !currentUser._id) {
      throw new Error('Current user is not available or does not have an ID.');
    }

    const friendId = req.body.friendId;
    if (!friendId) {
      throw new Error('Friend ID is not provided in the request body.');
    }

    await usersModel.findByIdAndUpdate(currentUser._id, { $addToSet: { friends: friendId } });
    await usersModel.findByIdAndUpdate(friendId, { $addToSet: { friends: currentUser._id } });

    res.redirect('/addFriends');
  } catch (err) {
    console.error('Error befriending user:', err);
    res.status(500).send('Error befriending user');
  }
});




// user profile
const profile = require('./routes/profile');
app.use(profile);

//other user's profile
const otherProfile = require('./routes/otherProfile');
app.use(otherProfile);

const login = require('./routes/login');
app.use(login);

const map = require('./routes/map');
app.use(map);


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


app.listen(3000, () => {
  console.log(`Server running on port 3000!!!`)
})  