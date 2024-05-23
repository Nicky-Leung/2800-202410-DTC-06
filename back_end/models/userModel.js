const mongoose = require('mongoose');
// const match = require('nodemon/lib/monitor/match');

const usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  type: String,
  bio: String,
  friends: Array,
  profilePicture: String,
  elo: Number,
  rank: String,
  sportsmanship: Number,
  streak: Boolean,
  streakCount: Number,
  matchHistory: Array,

});

const usersModel = mongoose.model('users', usersSchema);
module.exports = usersModel;