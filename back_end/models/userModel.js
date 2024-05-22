const mongoose = require('mongoose');
const match = require('nodemon/lib/monitor/match');

const usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  type: String,
  bio: String,
  // friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: Array,
  profilePicture: String,
  elo: Number,
  rank: String,
  sportsmanship: Number,
  streak: True,
  streakCount: Number,
  matchHistory: Array,

});

const usersModel = mongoose.model('users', usersSchema);
module.exports = usersModel;