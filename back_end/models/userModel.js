const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    type: String
  });
  
  const usersModel = mongoose.model('users', usersSchema);
  module.exports = usersModel;