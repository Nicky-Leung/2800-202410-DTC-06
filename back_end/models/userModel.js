const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  type: String,
  bio: String,
  // friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: Array,
});

const usersModel = mongoose.model('users', usersSchema);
module.exports = usersModel;