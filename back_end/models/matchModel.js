const mongoose = require('mongoose')

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
  const matchModel = mongoose.model('current_matches', createdMatchSchema);

  module.exports = matchModel;