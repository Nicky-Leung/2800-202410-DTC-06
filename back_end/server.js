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

const crypto = require('crypto');

// encrypt password to be stored in the database
function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
const mongoose = require('mongoose');



async function main() {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.9kdinuu.mongodb.net/`);
    console.log('Connected to MongoDB');
  }
  catch (err) {
    console.log(err);
  }
}

main().catch(err => console.log(err));

// every user had name email password and type (admin or not admin)
const usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  type: String
});

const usersModel = mongoose.model('gameSetMatch.user', usersSchema);

const createdMatchSchema = new mongoose.Schema({
    sport: String,
    location: String,
    length: Number,
    time: String,
    date: String,
    players: Number,
    skill: String,
    description: String

});
const sessionModel = mongoose.model('gameSetMatch.current_matches', createdMatchSchema);


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 },
  store: store,
}));

// home page
app.get('/', (req, res) => {

  res.render('home.ejs', { passwordUpdated: req.query.passwordUpdated })
})

// log in page
app.get('/login', (req, res) => {
  res.render('login.ejs')
});

// this is where user creates an account
app.get('/signup', (req, res) => {
  res.render('signup.ejs')
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const Joi = require('joi');
const { type } = require('os');

// enforce requirements for name password and email
const signUpSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': `Name is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
    'any.required': `Name is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`
  }),
  email: Joi.string().email().required().messages({
    'string.email': `Email must be a valid email address. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
    'string.empty': `Email is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
    'any.required': `Email is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`
  }),
  password: Joi.string().min(8).max(12).required().messages({
    'string.min': `Password must be at least 8 characters long. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
    'string.max': `Password must less than 13 characters long. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
    'string.empty': `Password is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
    'any.required': `Password is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`
  })
});

// create a new user and save to the database
app.post('/signup', async (req, res) => {
  const { error } = signUpSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { name, email, password } = req.body;
  const hashedPassword = hashPassword(password);
  try {
    const newUser = new usersModel({ name, email, password: hashedPassword, type: 'non-administrator' });
    await newUser.save();
    console.log('User created:', newUser);
    res.redirect('/login');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal Server Error');
  }
});

   
    // put welcome page here later

app.get('/index', (req, res) => {
    res.render('index')
}
);

app.get('/information', (req, res) => {

    res.render('information')
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
}); // put later in main func with db connection


// log the user in
app.post('/login', async (req, res) => {
  console.log('Login request received');
  try {
    const hashedPassword = hashPassword(req.body.password);
    const result = await usersModel.findOne({ email: req.body.email, password: hashedPassword });
    console.log('Query result:', result);
    if (result) {
      req.session.authenticated = true;
      req.session.type = result.type;
      req.session.name = result.name;
      req.session.email = result.email;
      return res.redirect('/protectedRoute');
    }
    console.log('Access denied');
    res.render('notLoggedIn.ejs', { message: 'Email and/or password not found. Please try again or sign up.' })
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

// reset password with email if user has forgotten password but remembers their email
app.get('/resetPasswordWithEmail', (req, res) => {
  res.render('resetPasswordWithEmail.ejs');
}
);
// find a user by email and let them reset their password 
// TODO: send an email to the user with a link to reset their password
app.post('/resetPasswordWithEmail', async (req, res) => {
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  try {
    const hashedPassword = hashPassword(newPassword);
    await usersModel.updateOne({ email: email }, { password: hashedPassword });
    res.redirect('/?passwordUpdated=true');
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send('Internal Server Error');
  }
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
app.get('/logout', isUserAuthenticated, (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
}
);

// user profile
app.get('/profile', isUserAuthenticated, (req, res) => {
  res.render('profile.ejs', { name: req.session.name, email: req.session.email, type: req.session.type })
});

// reset user while logged in
app.get('/resetPassword', isUserAuthenticated, (req, res) => {
  res.render('resetPassword.ejs');
});

// find user via email and then reset their password
app.post('/resetPassword', isUserAuthenticated, async (req, res) => {
  const newPassword = req.body.newPassword;
  const email = req.session.email;

  try {
    const user = await usersModel.findOne({ email: email });
    const hashedPassword = hashPassword(newPassword);
    await usersModel.updateOne({ email: email }, { password: hashedPassword });
    res.redirect('/?passwordUpdated=true');
  } catch (error) {
    console.error('Error during password reset:', error);
  }
});

app.post('/creatematch', async (req, res) => {





});


app.listen(3000, () => {
  console.log(`Server running on port 3000!!!`)
})  