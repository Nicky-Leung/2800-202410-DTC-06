const mongoose = require('mongoose');

const matchHistorySchema = new mongoose.Schema({
    sport: String,
    location: String,
    time: Date,
    date: Date,
    matchType: String,
    rank: String,
    elo: Number,
    score: {
        home: Number,
        away: Number
    },

});

// This is necessary to enable 2dsphere indexing for location
// createdMatchSchema.index({ location: '2dsphere' });

const matchHistoryModel = mongoose.model('match_history', matchHistorySchema);

module.exports = matchHistoryModel;